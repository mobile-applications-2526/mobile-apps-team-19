const SUPABASE_URL = "https://xbkaijymsgwlqwxibdqt.supabase.co";
const BUCKET = "test-imgs";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhia2Fpanltc2d3bHF3eGliZHF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTI5OTUsImV4cCI6MjA4MDU2ODk5NX0.ZDK-OhtWyXjSO-U40d3voA-IfGKkrvrd2WykGWBBgK8";



export async function uploadImageToSupabase(
    fileUri: string,
    eventName: string
): Promise<string> {
    try {
        const pictureId = generatePictureId();

        // Fetch the file and convert to blob
        const response = await fetch(fileUri);
        const blob = await response.blob();

        // Construct the file path using event name
        const sanitizedEventName = eventName.replace(/[^a-zA-Z0-9]/g, '_');
        const filePath = `events/${sanitizedEventName}/${pictureId}.jpg`;

        // Upload to Supabase Storage
        const uploadRes = await fetch(
            `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${filePath}`,
            {
                method: "POST",
                headers: {
                    "apikey": SUPABASE_ANON_KEY,
                    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                    "Content-Type": "image/jpeg",
                },
                body: blob,
            }
        );

        if (!uploadRes.ok) {
            const err = await uploadRes.text();
            throw new Error(`Supabase upload failed: ${err}`);
        }

        const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`;
        return publicUrl;
    } catch (error) {
        console.error('Error uploading to Supabase:', error);
        throw error;
    }
}


function generatePictureId(): string {
    return Math.random().toString(16).substring(2, 10);
}


export async function savePictureToBackend(
    eventName: string,
    pictureUrl: string
): Promise<void> {
    try {

        const encodedEventName = encodeURIComponent(eventName);
        const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/events/${encodedEventName}/add-picture`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ url: pictureUrl }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend request failed: ${response.status} - ${errorText}`);
        }
    } catch (error) {
        console.error('Error saving picture to backend:', error);
        throw error;
    }
}
