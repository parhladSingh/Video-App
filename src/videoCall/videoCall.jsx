import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = "6d5fc6ba9666445cbfc189505fa8a5fd";  // Agora Console se lo
const TOKEN = "YOUR_TEMP_TOKEN";     // Testing ke liye
const CHANNEL = "testchannel";       // Dono users ke liye same hona chahiye

const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

function VideoCall() {
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteUsers, setRemoteUsers] = useState({});

  useEffect(() => {
    const startCall = async () => {
      // Join channel
      await client.join(APP_ID, CHANNEL, TOKEN, null);

      // Create mic + camera tracks
      const [micTrack, camTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
      setLocalTracks([micTrack, camTrack]);

      // Play local video
      camTrack.play("local-player");

      // Publish tracks
      await client.publish([micTrack, camTrack]);

      // Handle remote users
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);

        if (mediaType === "video") {
          const remoteTrack = user.videoTrack;
          remoteTrack.play(`remote-player-${user.uid}`);
        }

        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user) => {
        setRemoteUsers((prev) => {
          const updated = { ...prev };
          delete updated[user.uid];
          return updated;
        });
      });
    };

    startCall();
  }, []);

  return (
    <div>
      <h2>Agora Video Call</h2>

      <div
        id="local-player"
        style={{ width: "400px", height: "300px", backgroundColor: "black" }}
      ></div>

      <div
        id="remote-player"
        style={{ width: "400px", height: "300px", backgroundColor: "gray" }}
      ></div>
    </div>
  );
}

export default VideoCall;
