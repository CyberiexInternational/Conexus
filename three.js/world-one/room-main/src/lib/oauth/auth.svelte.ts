import {
	configureOAuth,
	createAuthorizationUrl,
	finalizeAuthorization,
	resolveFromIdentity,
	type Session,
	OAuthUserAgent,
	getSession
} from '@atcute/oauth-browser-client';
import { dev } from '$app/environment';
import { CredentialManager, XRPC } from '@atcute/client';
import { metadata } from './const';
import { AtpBaseClient } from '@atproto/api';
import type { DidDocument } from '@atcute/client/utils/did';
import { type BlueskyBlob, type RoomStateType } from '$lib/room/state.svelte';
import { modals } from '$lib/room/ui-state.svelte';
import { getImage } from '$lib/room/images.svelte';
import { trackEvent } from '$lib/analytics';

export const client = $state({
	agent: null as OAuthUserAgent | null,
	session: null as Session | null,
	rpc: null as XRPC | null,
	profile: null as {
		handle: string;
		did: string;
		createdAt: string;
		description?: string;
		displayName?: string;
		banner?: string;
		avatar?: string;
		followersCount?: number;
		followsCount?: number;
		postsCount?: number;
	} | null,
	isInitializing: true,
	isLoggedIn: false,
	justLoggedIn: false
});

export async function initClient() {
	client.isInitializing = true;

	const clientId = dev
		? `http://localhost` +
			`?redirect_uri=${encodeURIComponent('http://127.0.0.1:5179')}` +
			`&scope=${encodeURIComponent(metadata.scope)}`
		: metadata.client_id;

	configureOAuth({
		metadata: {
			client_id: clientId,
			redirect_uri: `${dev ? 'http://127.0.0.1:5179' : metadata.redirect_uris[0]}`
		}
	});

	const params = new URLSearchParams(location.hash.slice(1));

	const did = localStorage.getItem('last-login') ?? undefined;

	if (params.size > 0) {
		await finalizeLogin(params, did);
	} else if (did) {
		await resumeSession(did);
	}

	client.isInitializing = false;
}

export async function login(handle: string) {
	if (handle.startsWith('did:')) {
		if (handle.length > 5) await authorizationFlow(handle);
		else throw new Error('DID must be at least 6 characters');
	} else if (handle.includes('.') && handle.length > 3) {
		const processed = handle.startsWith('@') ? handle.slice(1) : handle;
		if (processed.length > 3) await authorizationFlow(processed);
		else throw new Error('Handle must be at least 4 characters');
	} else if (handle.length > 3) {
		const processed = (handle.startsWith('@') ? handle.slice(1) : handle) + '.bsky.social';
		await authorizationFlow(processed);
	} else {
		throw new Error('Please provide a valid handle, DID, or PDS URL');
	}
}

export async function logout() {
	const currentAgent = client.agent;
	if (currentAgent) {
		const did = currentAgent.session.info.sub;

		localStorage.removeItem('last-login');
		localStorage.removeItem(`profile-${did}`);

		await currentAgent.signOut();
		client.session = null;
		client.agent = null;
		client.profile = null;

		client.isLoggedIn = false;
	} else {
		throw new Error('Not signed in');
	}
}

async function finalizeLogin(params: URLSearchParams, did?: string) {
	try {
		history.replaceState(null, '', location.pathname + location.search);

		const session = await finalizeAuthorization(params);
		client.session = session;

		setAgentAndXRPC(session);
		localStorage.setItem('last-login', session.info.sub);

		await loadProfile(session.info.sub);

		client.justLoggedIn = true;
		client.isLoggedIn = true;
	} catch (error) {
		console.error('error finalizing login', error);
		if (did) {
			await resumeSession(did);
		}
	}
}

async function resumeSession(did: string) {
	try {
		const session = await getSession(did as `did:${string}`, { allowStale: true });
		client.session = session;

		setAgentAndXRPC(session);

		await loadProfile(session.info.sub);

		client.isLoggedIn = true;
	} catch (error) {
		console.error('error resuming session', error);
	}
}

function setAgentAndXRPC(session: Session) {
	client.agent = new OAuthUserAgent(session);

	client.rpc = new XRPC({ handler: client.agent });
}

async function loadProfile(actor: string) {
	// check if profile is already loaded in local storage
	const profile = localStorage.getItem(`profile-${actor}`);
	if (profile) {
		console.log('loading profile from local storage');
		client.profile = JSON.parse(profile);
		return;
	}

	console.log('loading profile from server');
	const response = await client.rpc?.request({
		type: 'get',
		nsid: 'app.bsky.actor.getProfile',
		params: { actor }
	});

	if (response) {
		client.profile = response.data;
		localStorage.setItem(`profile-${actor}`, JSON.stringify(response.data));
	}
}

async function authorizationFlow(input: string) {
	const { identity, metadata: meta } = await resolveFromIdentity(input);

	const authUrl = await createAuthorizationUrl({
		metadata: meta,
		identity: identity,
		scope: metadata.scope
	});

	await new Promise((resolve) => setTimeout(resolve, 200));

	window.location.assign(authUrl);

	await new Promise((_resolve, reject) => {
		const listener = () => {
			reject(new Error(`user aborted the login request`));
		};

		window.addEventListener('pageshow', listener, { once: true });
	});
}

let agent: AtpBaseClient | null = null;

const didPDSCache: Record<string, string> = {};
const didDocCache: Record<string, DidDocument> = {};

const getPDS = async (did: string) => {
	if (did in didPDSCache) return didPDSCache[did];
	const res = await fetch(
		did.startsWith('did:web')
			? `https://${did.split(':')[2]}/.well-known/did.json`
			: 'https://plc.directory/' + did
	);

	return res.json().then((doc) => {
		if (!doc.service) throw new Error('No PDS found');
		for (const service of doc.service) {
			if (service.id === '#atproto_pds') {
				didPDSCache[did] = service.serviceEndpoint.toString();
				didDocCache[did] = doc;
			}
		}
		return didPDSCache[did];
	});
};

export async function getRoom({ did }: { did: string }): Promise<RoomStateType> {
	const pds = await getPDS(did);
	const rpc = new XRPC({ handler: new CredentialManager({ service: pds }) });

	const { data } = await rpc.get('com.atproto.repo.getRecord', {
		params: {
			repo: did,
			collection: 'dev.flo-bit.room',
			rkey: 'self'
		}
	});

	// get profile
	const profile = await getProfile({ did });

	// @ts-expect-error data.value is not typed
	const room = data.value.roomState as RoomStateType;
	room.profile = profile;

	return room;
}

export async function getProfile({ did }: { did: string }) {
	if (!agent) {
		agent = new AtpBaseClient({ service: 'https://public.api.bsky.app' });
	}

	const data = await agent.app.bsky.actor.getProfile({ actor: did });
	return data.data;
}

export async function resolveHandle({ handle }: { handle: string }) {
	if (!agent) {
		agent = new AtpBaseClient({ service: 'https://public.api.bsky.app' });
	}

	const data = await agent.com.atproto.identity.resolveHandle({ handle });
	return data.data.did;
}

export async function uploadImage(image: Blob) {
	if (!client.profile) throw new Error('No profile');

	// atcute version
	const blobResponse = await client.rpc?.request({
		type: 'post',
		nsid: 'com.atproto.repo.uploadBlob',
		params: {
			repo: client.profile.did
		},
		data: image
	});

	return blobResponse?.data.blob as {
		$type: 'blob';
		ref: {
			$link: string;
		};
		mimeType: string;
		size: number;
	};
}

export async function getImageBlobUrl({ did, link }: { did: string; link: string }) {
	return `https://cdn.bsky.app/img/feed_thumbnail/plain/${did}/${link}@jpeg`;
}

export async function saveRoomToBluesky(roomState: RoomStateType) {
	if (!client.rpc || !client.profile) {
		throw new Error('Failed to save room, please log in first');
	}

	try {
		trackEvent('room_save_try');

		const uploadedMap: Record<string, BlueskyBlob> = {};
		// upload all images
		for (const object of roomState.objects) {
			if (typeof object.image !== 'string' || !object.image.startsWith('local:')) continue;

			if (uploadedMap[object.image]) {
				object.image = uploadedMap[object.image];
				continue;
			}
			const name = object.image;
			const imageDataUrl = await getImage(name.replace('local:', ''));
			const blob = await fetch(imageDataUrl).then((res) => res.blob());
			object.image = await uploadImage(blob);
			uploadedMap[name] = object.image;
		}

		await client.rpc.call('com.atproto.repo.putRecord', {
			data: {
				collection: 'dev.flo-bit.room',
				repo: client.profile.did,
				rkey: 'self',
				record: {
					roomState: JSON.parse(
						JSON.stringify({
							wallColor: roomState.wallColor,
							floorColor: roomState.floorColor,
							objects: roomState.objects,
							size: roomState.size,
							id: roomState.id,
							version: roomState.version
						})
					)
				}
			}
		});

		trackEvent('room_save_success');

		modals.successModalState = true;
	} catch (e) {
		console.error(e);
		trackEvent('room_save_error', { error: JSON.stringify(e) });

		// logout
		await logout();

		throw new Error('Failed to save room, please login again and try again');
	}
}
