import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useMemo, useRef, useState } from "react";
import { useBreakpoint } from "./hooks/useBreakPoints";
import { useEffectSkipFirst } from "./hooks/useEffectSkipFirst";

const DemoCasino = () => {
  const iFrameRef = useRef(null);
  const [isMobileResponsive, setIsMobileResponsive] = useState(false);
  const [sid, setSid] = useState("");
  const { breakpoint, windowSize } = useBreakpoint();
  const isMobile = useMemo(() => breakpoint === "xs", [breakpoint]);
  const [foreignId, setForeignId] = useState();

  useEffect(() => {
    const foreignIdCookie = Cookies.get("foreignId");

    if (!foreignIdCookie) {
      const mockedForeignId = "mocked-casino-" + Math.random() * 10 ** 8;
      Cookies.set("foreignId", mockedForeignId);
      setForeignId(mockedForeignId);
    } else {
      setForeignId(foreignIdCookie);
    }
  }, []);

  useEffect(() => {
    setIsMobileResponsive(false);
    // Get the modal
    var modal = document.getElementById("myModal");
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    const openModal = () => {
      //@ts-ignore
      modal.style.display = "block";
    };

    const closeModal = () => {
      //@ts-ignore
      modal.style.display = "none";
    };

    // When the user clicks on <span> (x), close the modal
    if (span) {
      //@ts-ignore
      span.onclick = function () {
        //@ts-ignore
        modal.style.display = "none";
      };
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
      if (event.target === modal) {
        //@ts-ignore
        modal.style.display = "none";
      }
    };

    window.addEventListener("message", (e) => {
      if (e.origin !== process.env.REACT_APP_IFRAME) {
      // if (e.origin !== "https://casino.demo.rewindprotocol.com") {
        return;
      }
      if (e.data.command === "OPEN_MODAL") {
        openModal();
      } else if (e.data.command === "CLOSE_MODAL") {
        closeModal();
      }
    });
  }, []);

  useEffectSkipFirst(() => {
    if (foreignId) {
      axios
        .post(
          `${process.env.REACT_APP_MOCKED_CASINO}get-iframe-url`,
          {
            foreignId,
          },
          {
            headers: {
              "content-type": "application/json",
            },
          }
        )
        .then((res) => {
          const stringArr = res.data.split("=");
          const sid = stringArr[stringArr.length - 1];
          setSid(sid);

          const desktopModalIframe = document.getElementById(
            "rewind-iframe-modal"
          );
          if (desktopModalIframe) {
            //@ts-ignore
            desktopModalIframe.src = `${process.env.REACT_APP_IFRAME}/app/modal/bonus-list?isModal=true&sid=${sid}`;
          }
        })
        .catch((err) => err?.response);
    }
  }, [foreignId]);

  const [value, setValue] = useState("");

  const setForeignIdCoookie = () => {
    Cookies.set("foreignId", value);
    setForeignId(value)
  }

  useEffect(() => {
    setValue(foreignId)
  }, [foreignId]);

  return (
    <>
      <header></header>
      <div className="content">
        <nav></nav>
        <div className="content__central"></div>
        <div className={"content__right"}>
          <div className="content__right__top">
            <div className="content__right__top-input-wrapper">
              <label>Enter foreignId</label>
              <input value={value} onChange={e => setValue(e.target.value)} type="text" />
              <button onClick={setForeignIdCoookie} disabled={!value}>Submit!</button>
            </div>
          </div>
          <iframe
            ref={iFrameRef}
            title="Child iframe"
            id={
              isMobile && isMobileResponsive
                ? "rewind-iframe-mobile"
                : "rewind-iframe"
            }
            frameBorder="0"
            src={`${process.env.REACT_APP_IFRAME}/app/iframe?theme=${"BLUE_DARK"}&isMobile=${true}&windowSizeWidth=${
              windowSize.width
            }&isMobileResponsive=${isMobileResponsive}&sid=${sid}&foreignId=${foreignId}`}
          ></iframe>
          <div className="content__right__bottom"></div>
        </div>
      </div>
      <footer>
        <div id="myModal" className="modal">
          <div className="modal-content">
            <span className="close">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle opacity="0.8" cx="11" cy="11" r="11" fill="black" />
                <path
                  d="M6 6L16 16"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 6L6 16"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <iframe
              title="rewind-iframe-modal-2"
              id="rewind-iframe-modal"
              frameBorder="0"
              width="100%"
              src={`${process.env.REACT_APP_IFRAME}/app/modal/bonus-list?isModal=true`}
            ></iframe>
          </div>
        </div>
      </footer>
    </>
  );
};

export default DemoCasino;
