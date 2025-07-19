/* eslint-disable react/prop-types */
import { FaPlus } from "react-icons/fa";
import { createContext, useEffect, useState } from "react";

type CloudinaryProps = { loaded: boolean }
interface UploadWidgetProps {
  uwConfig: object; 
  setAvatar: (url: string) => void;
}

const CloudinaryScriptContext = createContext<CloudinaryProps | null>(null);

function UploadWidget({ uwConfig, setAvatar }: UploadWidgetProps) {
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      var myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            setAvatar(result.info.secure_url);
          }
        }
      );

      document.getElementById("upload_widget")?.addEventListener(
        "click",
        function () {
          myWidget.open();
        },
        false
      );
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <div
        id="upload_widget"
        className="text-black"
        onClick={initializeCloudinaryWidget}
      >
        <FaPlus size={30} opacity={0.7} className="cursor-pointer" />
      </div>
    </CloudinaryScriptContext.Provider>
  );
}

export default UploadWidget;
export { CloudinaryScriptContext };
