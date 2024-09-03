import React from "react";
import ChildHoverVideo from "./ChildHoverVideo";

const HoverChild= () => {
  const imageSrc =
  "https://th.bing.com/th/id/R.51ae2aebb0b1412db266c4157bf610af?rik=gHlXcb8GYg9p%2fg&riu=http%3a%2f%2fst.gde-fon.com%2fwallpapers_original%2f6725_polyarnyj-yekspress_or_the-polar-express_1280x1040_www.Gde-Fon.com.jpg&ehk=lUGH1M0ROXKskXnSgKyRvMp%2bNSG0AKDTOLPg6YSp2vw%3d&risl=&pid=ImgRaw&r=0";
  const videoSrc = "videos/PExpress.mp4";
  const title = "PolarExpress";
  const description =
    "This is the story of a young hero boy who boards on a powerful magical train that's headed to the North Pole and Santa Claus' home on Christmas Eve night.";

  return (
    <div>
      <ChildHoverVideo
        imageSrc={imageSrc}
        videoSrc={videoSrc}
        title={title}
        description={description}
      />
    </div>
  );
};

export default HoverChild;


