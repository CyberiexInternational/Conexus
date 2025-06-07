const imageState: {
	db: IDBDatabase | null;
} = $state({
	db: null
});

export function openDB(): Promise<IDBDatabase> {
	if (imageState.db) {
		return Promise.resolve(imageState.db);
	}

	return new Promise((resolve, reject) => {
		const request = indexedDB.open('ImageDB', 1);

		request.onupgradeneeded = function (event) {
			if (!event.target || !('result' in event.target)) {
				console.error('Error opening IndexedDB.');
				reject(new Error('Error opening IndexedDB.'));
				return;
			}

			const db = event.target.result as IDBDatabase;
			// Create an object store to hold image blobs if it doesn't already exist
			if (!db.objectStoreNames.contains('images')) {
				db.createObjectStore('images', { keyPath: 'id' });
			}
		};

		request.onsuccess = function (event) {
			if (!event.target || !('result' in event.target)) {
				console.error('Error opening IndexedDB.');
				reject(new Error('Error opening IndexedDB.'));
				return;
			}

			imageState.db = event.target.result as IDBDatabase;
			resolve(imageState.db);
		};

		request.onerror = function () {
			console.error('Error opening IndexedDB.');
			reject(new Error('Error opening IndexedDB.'));
		};
	});
}

export function saveImage(imageId: string, image: Blob) {
	if (!imageState.db) {
		console.error('DB not open');
		return;
	}
	const transaction = imageState.db.transaction(['images'], 'readwrite');
	const store = transaction.objectStore('images');
	store.put({ id: imageId, blob: image });
}

export async function getImage(imageId: string): Promise<string> {
	if (!imageState.db) {
		await openDB();
	}
	const db = imageState.db;
	return new Promise((resolve, reject) => {
		if (!db) return reject(new Error('DB not open'));

		// Ensure the 'images' object store exists
		if (!db.objectStoreNames.contains('images')) {
			reject(new Error("Object store 'images' not found in the provided database."));
			return;
		}

		const transaction = db.transaction(['images'], 'readonly');
		const store = transaction.objectStore('images');
		const getRequest = store.get(imageId);

		getRequest.onsuccess = function (event) {
			if (!event.target || !('result' in event.target)) {
				reject(new Error('Error retrieving the image from IndexedDB'));
				return;
			}
			const record = event.target.result;
			if (record && typeof record === 'object' && 'blob' in record) {
				const objectURL = URL.createObjectURL(record.blob as Blob);
				resolve(objectURL);
			} else {
				reject(new Error('Image not found in IndexedDB'));
			}
		};

		getRequest.onerror = function () {
			reject(new Error('Error retrieving the image from IndexedDB'));
		};
	});
}

export function deleteImage(imageId: string) {
	if (!imageState.db) {
		console.error('DB not open');
		return;
	}
	const transaction = imageState.db.transaction(['images'], 'readwrite');
	const store = transaction.objectStore('images');
	store.delete(imageId);
	console.log('Deleted image', imageId);
}

export function getAllImageNames(): Promise<string[]> {
	return new Promise((resolve, reject) => {
		if (!imageState.db) {
			reject(new Error('DB not open'));
			return;
		}
		const db = imageState.db;
		if (!db.objectStoreNames.contains('images')) {
			reject(new Error("Object store 'images' not found in the provided database."));
			return;
		}
		const transaction = db.transaction(['images'], 'readonly');
		const store = transaction.objectStore('images');
		const request = store.getAllKeys();

		request.onsuccess = function () {
			resolve(request.result as string[]);
		};

		request.onerror = function () {
			reject(new Error('Error retrieving image keys from IndexedDB'));
		};
	});
}
