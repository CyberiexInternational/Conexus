import { type RoomObjectKind } from './models';

import type { ProfileViewDetailed } from '@atproto/api/dist/client/types/app/bsky/actor/defs';

export const currentVersion = 0;

export type RoomStateType = {
	wallColor: string;
	floorColor: string;
	objects: RoomObjectData[];

	size: { x: number; z: number };

	id: number;

	version: number;

	profile?: ProfileViewDetailed;
};

export const roomState: RoomStateType = $state({
	wallColor: '#f1f1f1',
	floorColor: '#a1a1a1',

	objects: [],

	size: { x: 2, z: 3 },

	id: 0,

	version: currentVersion
});

export type BlueskyBlob = {
	$type: 'blob';
	ref: {
		$link: string;
	};
	mimeType: string;
	size: number;
	did: string;
};

export type RoomObjectData = {
	kind: RoomObjectKind;
	position: [number, number, number];
	rotation: number;
	colors: string[];
	placement: 'floor' | 'wallX' | 'wallZ';
	link?: string;
	image?: string | BlueskyBlob;
};
