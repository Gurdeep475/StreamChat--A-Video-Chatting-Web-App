// Request Video and Audio Acess
const user = prompt("Enter your name");
const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;
var peer = new Peer(undefined,{
  port: 443
});

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        console.log("Answering the call");
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream);
    });

    let text = $("input");
    $("html").keydown((e) => {
      if (e.which == 13 && text.val().length !== 0) {
        console.log(text.val());
        socket.emit("message", text.val(), user);
        text.val("");
      }
    });

    socket.on("createMessage", (message, user) => {
      $("ul").append(
        `<div class="messageBox"><li><b>${user}</b> : ${message}</li></div>`
      );
      scrollToBottom();
    });
  });

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });

  videoGrid.append(video);
};

const scrollToBottom = () => {
  var d = $(".main__chat_window");
  d.scrollTop(d.prop("scrollHeight"));
};

// Mute our Video
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmutedButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
};

const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const setUnmutedButton = () => {
  const html = `
    <i class="Unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `;
  document.querySelector(".main__mute_button").innerHTML = html;
};

const playStop = () => {
  let enabled = myVideoStream.getVideoTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getVideoTracks()[0].enabled = false;
    setPlayVideo();
  } else {
    setStopVideo();
    myVideoStream.getVideoTracks()[0].enabled = true;
  }
};


const setPlayVideo = () => {
  const html = `
    <i class="stop fas fa-video"></i>
    <span>Play Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
}

const setStopVideo = () => {
  const html = `
    <i class="fas fa-video-slash"></i>
    <span>Stop Video</span>
  `;
  document.querySelector(".main__video_button").innerHTML = html;
}