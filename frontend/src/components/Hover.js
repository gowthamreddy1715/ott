// App.js
import React from "react";
import HoverVideo from "./HoverVideo";

const App = () => {
  const imageSrc =
    "https://i.ytimg.com/vi/E3D_s5f7fFc/hq720.jpg?sqp=-oaymwEXCK4FEIIDSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLAwx_StDiSkfYPfjGpy9ut3XPPEgg";
    const videoSrc = `videos/hinanna.webm`;
  const title = "Hi Nanna";
  const description =
    "A single father begins to narrate the story of the missing mother to his child and nothing remains the same.";

  return (
    <div>
      <HoverVideo
        imageSrc={imageSrc}
        videoSrc={videoSrc}
        title={title}
        description={description}
      />
    </div>
  );
};

export default App;