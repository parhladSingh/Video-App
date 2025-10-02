import React, { useState } from 'react';
import AgoraUIKit from 'agora-react-uikit';

const App = () => {
  const [videoCall, setVideoCall] = useState(false);
  const [channelName, setChannelName] = useState('');
  const [userType, setUserType] = useState('host'); // 'host' or 'client'
  const [cameraError, setCameraError] = useState(false);

  const rtcProps = {
    appId: '6d5fc6ba9666445cbfc189505fa8a5fd',
    channel: channelName,
    token: '007eJxTYFjoe/7yykdWVfpFks7B9ir/8mQMBLrNzvwOVdWQyFv6rkCBwSzFNC3ZLCnR0szMzMTENDkpLdnQwtLUwDQt0SLRNC0lyf9eRkMgI8Of760MjFAI4rMw5CZm5jEwAAD4/R8w',
    role: userType === 'host' ? 'host' : 'audience', // Host = camera ON, Client = camera OFF
    layout: 0,
    enableRTM: false,
    uid: 0,
  };

  const callbacks = {
    EndCall: () => {
      setVideoCall(false);
      setCameraError(false);
    },
    'rtc-error': (error) => {
      console.error('RTC Error:', error);
      if (error.msg.includes('camera') || error.msg.includes('video')) {
        setCameraError(true);
      }
    },
  };

  const styleProps = {
    localBtnContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      bottom: 30,
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      gap: '15px',
      zIndex: 999,
      padding: '15px 25px',
      borderRadius: '50px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
    },
    UIKitContainer: {
      height: '100%',
      width: '100%',
      backgroundColor: '#000',
    },
    videoView: {
      backgroundColor: '#1a1a1a',
    },
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      fontFamily: 'Arial, sans-serif', 
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      backgroundColor: '#000',
    }}>
      {!videoCall ? (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e1e1e',
            color: '#fff',
            padding: '20px',
          }}
        >
          <div style={{
            backgroundColor: '#2a2a2a',
            padding: '40px',
            borderRadius: '15px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            maxWidth: '450px',
            width: '90%',
          }}>
            <h1 style={{ 
              marginBottom: '10px', 
              fontSize: '28px',
              textAlign: 'center',
              color: '#fff',
            }}>
              🎥 Video Call
            </h1>
            <p style={{ 
              marginBottom: '30px', 
              color: '#999',
              textAlign: 'center',
              fontSize: '14px',
            }}>
              Join or host a video meeting
            </p>
            
            <input
              type="text"
              placeholder="Enter Channel Name (e.g., room123)"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && channelName.trim() !== '') {
                  setVideoCall(true);
                }
              }}
              style={{
                padding: '14px 18px',
                width: '100%',
                fontSize: '16px',
                borderRadius: '8px',
                border: '2px solid #444',
                marginBottom: '25px',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />

            {/* User Type Selection */}
            <div style={{ 
              marginBottom: '25px',
              padding: '15px',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
            }}>
              <p style={{ 
                fontSize: '14px', 
                marginBottom: '12px',
                color: '#aaa',
              }}>
                Select your role:
              </p>
              
              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                marginBottom: '12px',
                cursor: 'pointer',
                padding: '8px',
                backgroundColor: userType === 'host' ? '#007bff22' : 'transparent',
                borderRadius: '6px',
                border: userType === 'host' ? '2px solid #007bff' : '2px solid transparent',
              }}>
                <input
                  type="radio"
                  value="host"
                  checked={userType === 'host'}
                  onChange={(e) => setUserType(e.target.value)}
                  style={{ 
                    marginRight: '10px',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                  }}
                />
                <div>
                  <strong style={{ color: '#fff' }}>Host</strong>
                  <span style={{ 
                    display: 'block', 
                    fontSize: '12px', 
                    color: '#888',
                    marginTop: '2px',
                  }}>
                    Share your camera and audio
                  </span>
                </div>
              </label>

              <label style={{ 
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px',
                backgroundColor: userType === 'client' ? '#28a74522' : 'transparent',
                borderRadius: '6px',
                border: userType === 'client' ? '2px solid #28a745' : '2px solid transparent',
              }}>
                <input
                  type="radio"
                  value="client"
                  checked={userType === 'client'}
                  onChange={(e) => setUserType(e.target.value)}
                  style={{ 
                    marginRight: '10px',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                  }}
                />
                <div>
                  <strong style={{ color: '#fff' }}>Client (Viewer)</strong>
                  <span style={{ 
                    display: 'block', 
                    fontSize: '12px', 
                    color: '#888',
                    marginTop: '2px',
                  }}>
                    Watch only, no camera needed
                  </span>
                </div>
              </label>
            </div>

            <button
              onClick={() => {
                if (channelName.trim() === '') {
                  alert('⚠️ Please enter a channel name');
                } else {
                  setVideoCall(true);
                }
              }}
              style={{
                padding: '14px 20px',
                width: '100%',
                backgroundColor: '#007bff',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
            >
              Join Call 🚀
            </button>
            
            <div style={{ 
              marginTop: '25px', 
              padding: '15px',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              border: '1px solid #333',
            }}>
              <p style={{ 
                fontSize: '12px', 
                color: '#888',
                margin: 0,
                lineHeight: '1.6',
              }}>
                💡 <strong style={{ color: '#fff' }}>Tips:</strong><br/>
                • Share the same channel name with others<br/>
                • Host needs camera permission<br/>
                • Clients can just watch without camera
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ 
          height: '100%', 
          width: '100%', 
          position: 'relative', 
          backgroundColor: '#000',
        }}>
          {cameraError && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center',
              color: '#fff',
              maxWidth: '400px',
            }}>
              <h2 style={{ color: '#ff4444', marginBottom: '15px' }}>⚠️ Camera Error</h2>
              <p style={{ color: '#ccc', marginBottom: '20px' }}>
                {userType === 'host' 
                  ? 'Cannot access camera. Please allow camera permissions in your browser or switch to Client mode.'
                  : 'Connection issue. Please try again.'
                }
              </p>
              <button
                onClick={() => {
                  setVideoCall(false);
                  setCameraError(false);
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Go Back
              </button>
            </div>
          )}
          
          {!cameraError && (
            <AgoraUIKit 
              rtcProps={rtcProps} 
              callbacks={callbacks}
              styleProps={styleProps}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;