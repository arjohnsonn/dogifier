import { useState } from "react";
import pawPrint from "./assets/paw-print.svg";
import Button from "./components/Button";
import { OrbitProgress } from "react-loading-indicators";
import submitImage from "./utils/submitImage";

function App() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dogImage, setDogImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  return (
    <>
      <main className="flex flex-col w-84 bg-gradient-to-br from-[#9b3a3a] to-[#262626]">
        <div className="flex flex-row justify-center w-full mt-4 csshadow">
          <h1 className="text-4xl font-bold text-white mr-3">Dogifier</h1>
          <img
            src={pawPrint}
            alt="Paw Print"
            className="w-8 h-8"
            style={{ filter: "brightness(0) invert(1)" }} // to make it white
          />
        </div>

        <h3 className="text-md font-medium text-white text-center mt-1 csshadow">
          Add a dog to any photo using AI
        </h3>

        <div className="p-4">
          <div className="flex flex-col w-full items-center mt-4 rounded-2xl p-3 bg-black/40">
            {!loading && (
              <div className="p-2 bg-black/30 rounded-lg w-full flex flex-col items-center">
                <label
                  htmlFor="fileInput"
                  className="text-sm font-semibold text-center w-full cursor-pointer"
                >
                  {imagePreview ? "Change Photo" : "Upload Photo"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="fileInput"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (e.target.files && e.target.files[0]) {
                      setImagePreview(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </div>
            )}

            {dogImage ? (
              <img src={dogImage} alt="Dogified" className="mt-2 rounded" />
            ) : (
              imagePreview && (
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  className="mt-2 rounded"
                />
              )
            )}
          </div>
        </div>

        <div className="w-full flex flex-col items-center">
          {error && (
            <p className="text-red-500 text-sm font-semibold mb-3">{error}</p>
          )}
          {loading ? (
            <OrbitProgress
              color="#ffffff"
              size="small"
              text=""
              style={{ width: "20px", height: "20px" }}
            />
          ) : (
            <div className="flex flex-row gap-x-2">
              {dogImage ? (
                <div className="flex flex-row gap-x-2">
                  <Button
                    text={`COPY`}
                    color="bg-[#404040]"
                    onClick={() => {
                      fetch(dogImage!)
                        .then((response) => response.blob())
                        .then((blob) => {
                          const item = new ClipboardItem({ [blob.type]: blob });
                          return navigator.clipboard.write([item]);
                        })
                        .catch((err) => {
                          console.error("Failed to copy image:", err);
                        });
                    }}
                  />
                  <Button
                    text={`SAVE`}
                    color="bg-[#404040]"
                    onClick={() => {
                      fetch(dogImage)
                        .then((response) => response.blob())
                        .then((blob) => {
                          const url = window.URL.createObjectURL(blob);
                          const link = document.createElement("a");
                          link.href = url;
                          link.download = "dogified.png";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          window.URL.revokeObjectURL(url);
                        })
                        .catch((err) => {
                          console.error("Error saving image:", err);
                        });
                    }}
                  />
                  <Button
                    text={`RESET`}
                    color="bg-[#404040]"
                    onClick={() => {
                      setDogImage(null);
                      setImagePreview(null);
                      setError(null);
                      setLoading(false);

                      const fileInput = document.getElementById(
                        "fileInput"
                      ) as HTMLInputElement;
                      if (fileInput) {
                        fileInput.value = "";
                      }
                    }}
                  />
                </div>
              ) : (
                <Button
                  text="DOGIFY"
                  color="bg-[#D93B3A]"
                  onClick={async () => {
                    setLoading(true);
                    setDogImage(null);

                    const { URL, Error } = await submitImage({
                      imagePath: imagePreview!,
                    });

                    if (URL) {
                      setDogImage(URL);
                    } else {
                      setError(Error!);
                    }

                    setLoading(false);
                  }}
                />
              )}
            </div>
          )}

          <div className="p-4 flex flex-col items-center">
            <p className="text-xs font-semilight text-white text-center">
              <b>Fun Fact:</b> Studies show that dogs do well on dating
              profiles!
            </p>
          </div>

          <div className="-mt-2 flex flex-col items-center">
            <Button
              text={`View Disclaimer ${showDisclaimer ? "▲" : "▼"}`}
              style="px-5 py-2 font-semibold text-white rounded-2xl csshadow-lt cursor-pointer"
              onClick={() => {
                setShowDisclaimer(!showDisclaimer);
              }}
            />
            {showDisclaimer ? (
              <div className="p-4 -mt-2 flex flex-col items-center">
                <p className="text-xs font-semilight text-white text-center">
                  This extension is for entertainment purposes only. You{" "}
                  <i>shouldn't</i> use fake dogs on dating profiles. You can
                  improve your dating profile by using{" "}
                  <a
                    className="text-blue-500 underline"
                    target="_blank"
                    href="https://yourmove.ai"
                  >
                    YourMove.AI
                  </a>
                </p>
              </div>
            ) : (
              <p className="text-xs mb-2">
                {/* Made by{" "}
                <a
                  className="text-blue-500 underline"
                  target="_blank"
                  href="https://yourmove.ai"
                >
                  YourMove.AI
                </a> */}
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
