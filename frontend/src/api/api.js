const BASE_URL = "http://localhost:8080/api/meetings";

export async function uploadMeeting(file, title) {
  const formData = new FormData();
  formData.append("file", file);
  if (title) formData.append("title", title);

  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function getAllMeetings() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch meetings");
  return res.json();
}

export async function getMeetingById(id) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch meeting");
  return res.json();
}

export async function deleteMeeting(id) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete meeting");
  return res.json();
}