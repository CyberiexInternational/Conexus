import { trackEvent } from '$lib/analytics';
import { getRoom, resolveHandle } from '$lib/oauth/auth.svelte';
import { AllObjects } from './models';
import { roomState, type RoomObjectData } from './state.svelte';

export async function loadRoomFromBluesky(handle: string) {
	const did = await resolveHandle({ handle });
	const room = await getRoom({ did });

	const availableObjects = new Set(Object.keys(AllObjects));

	const filteredObjects = room.objects.filter((object: RoomObjectData) =>
		availableObjects.has(object.kind as string)
	);
	if (filteredObjects.length !== room.objects.length) {
		console.warn('some objects were not found and removed!');
	}

	for (const object of filteredObjects) {
		if (object.image && typeof object.image === 'object') {
			object.image.did = did;
		}
	}

	roomState.objects = filteredObjects;
	roomState.wallColor = room.wallColor;
	roomState.floorColor = room.floorColor;
	roomState.size = room.size;
	roomState.id = room.id;
	roomState.version = room.version;
	roomState.profile = room.profile;

	trackEvent('room_view', {
		view_handle: handle
	});

	return {
		...room,
		objects: filteredObjects
	};
}
