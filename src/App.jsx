import React,{useEffect} from 'react'
import './index.css'
import {languages} from './languages.js'
import sun from './assets/sun.png'
import moon from './assets/moon.png'

function App() {
  useEffect(() => {
    const dropdowns = document.querySelectorAll(".dropdown-container"),
      inputLanguageDropdown = document.querySelector("#input-language"),
      outputLanguageDropdown = document.querySelector("#output-language"),
      inputTextElem = document.querySelector("#input-text"),
      outputTextElem = document.querySelector("#output-text"),
      inputChars = document.querySelector("#input-chars"),
      swapBtn = document.querySelector(".swap-position"),
      uploadDocument = document.querySelector("#upload-document"),
      uploadTitle = document.querySelector("#upload-title"),
      downloadBtn = document.querySelector("#download-btn");

    // Function to populate dropdown with options
    function populateDropdown(dropdown, options) {
      console.log(dropdown,options)
      dropdown.querySelector("ul").innerHTML = "";
      options.forEach((option) => {
        const li = document.createElement("li");
        const title = option.name + " (" + option.native + ")";
        li.innerHTML = title;
        li.dataset.value = option.code;
        li.classList.add("option");
        dropdown.querySelector("ul").appendChild(li);
      });
    }

    // Populate input and output language dropdowns
    populateDropdown(inputLanguageDropdown, languages);
    populateDropdown(outputLanguageDropdown, languages);

    // Function to toggle dropdown visibility
    function toggleDropdown(dropdown) {
      dropdown.classList.toggle("active");
    }

    // Function to handle language selection
    function handleLanguageSelection(dropdown, item) {
      dropdown.querySelectorAll(".option").forEach((item) => {
        item.classList.remove("active");
      });
      item.classList.add("active");
      const selected = dropdown.querySelector(".selected");
      selected.innerHTML = item.innerHTML;
      selected.dataset.value = item.dataset.value;
      translate();
    }

    // Function to swap input and output languages
    function swapLanguages() {
      const temp = inputLanguageDropdown.querySelector(".selected").innerHTML;
      inputLanguageDropdown.querySelector(".selected").innerHTML = outputLanguageDropdown.querySelector(".selected").innerHTML;
      outputLanguageDropdown.querySelector(".selected").innerHTML = temp;

      const tempValue = inputLanguageDropdown.querySelector(".selected").dataset.value;
      inputLanguageDropdown.querySelector(".selected").dataset.value = outputLanguageDropdown.querySelector(".selected").dataset.value;
      outputLanguageDropdown.querySelector(".selected").dataset.value = tempValue;

      const tempInputText = inputTextElem.value;
      inputTextElem.value = outputTextElem.value;
      outputTextElem.value = tempInputText;

      translate();
    }

  // Translate Functiom
    function translate() {
      const inputText = inputTextElem.value;
      const inputLanguage = inputLanguageDropdown.querySelector(".selected").dataset.value;
      const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${inputLanguage}&tl=${outputLanguage}&dt=t&q=${encodeURI(inputText)}`;
      fetch(url)
        .then((response) => response.json())
        .then((json) => {
          outputTextElem.value = json[0].map((item) => item[0]).join("");
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // Event listeners
    dropdowns.forEach((dropdown) => {
      dropdown.addEventListener("click", (e) => {
        toggleDropdown(dropdown);
      });

      dropdown.querySelectorAll(".option").forEach((item) => {
        item.addEventListener("click", (e) => {
          handleLanguageSelection(dropdown, item);
        });
      });
    });

    document.addEventListener("click", (e) => {
      dropdowns.forEach((dropdown) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove("active");
        }
      });
    });

    swapBtn.addEventListener("click", swapLanguages);

  // Input Limit  
    inputTextElem.addEventListener("input", (e) => {
      if (inputTextElem.value.length > 5000) {
        inputTextElem.value = inputTextElem.value.slice(0, 5000);
      }
      inputChars.innerHTML = inputTextElem.value.length;
      translate();
    });

  // Upload Button  
    uploadDocument.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (
        file.type === "application/pdf" ||
        file.type === "text/plain" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        uploadTitle.innerHTML = file.name;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = (e) => {
          inputTextElem.value = e.target.result;
          translate();
        };
      } else {
        alert("Please upload a valid file");
      }
    });

  // Download Button  
    downloadBtn.addEventListener("click", (e) => {
      const outputText = outputTextElem.value;
      const outputLanguage = outputLanguageDropdown.querySelector(".selected").dataset.value;
      if (outputText) {
        const blob = new Blob([outputText], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.download = `translated-to-${outputLanguage}.txt`;
        a.href = url;
        a.click();
      }
    });

  // Dark-Light Theme  
    const darkModeCheckbox = document.getElementById("dark-mode-btn");
    const handleDarkModeToggle = () => {
      document.body.classList.toggle("dark");
    };
    darkModeCheckbox.addEventListener("change", handleDarkModeToggle);
    return () => {
      darkModeCheckbox.removeEventListener("change", handleDarkModeToggle);
    };
  },[]);

  return (
    <>
      <div className="mode">
        <label className="toggle" htmlFor="dark-mode-btn">
          <div className="toggle-track">
            <input type="checkbox" className="toggle-checkbox" id="dark-mode-btn"/>
            <span className="toggle-thumb"></span>
            <img src={sun} alt="" />
            <img src={moon} alt="" />
          </div>
        </label>
      </div>
      <div className="container">
        <div className="card input-wrapper">
          <div className="from">
            <span className="heading">From :</span>
              <div className="dropdown-container" id="input-language">
                <div className="dropdown-toggle">
                  <ion-icon name="globe-outline"></ion-icon>
                  <span className="selected" data-value="auto">Auto Detect</span>
                  <ion-icon name="chevron-down-outline"></ion-icon>
                </div>
                <ul className="dropdown-menu">
                  <li className="option active">DropDown Menu Item 1</li>
                  <li className="option">DropDown Menu Item 2</li>
                </ul>
              </div>
            </div>
          <div className="text-area">
            <textarea className='input-text' id="input-text" cols="30" rows="10" placeholder="Enter your text here"></textarea>
            <div className="chars"><span id="input-chars">0</span> / 5000</div>
          </div>
          <div className="card-bottom">
            <p>Or choose your document!</p>
            <label htmlFor="upload-document">
              <span id="upload-title">Choose File</span>
              <ion-icon name="cloud-upload-outline"></ion-icon>
              <input type="file" id="upload-document" hidden />
            </label>
          </div>
        </div>
        <div className="center">
          <div className="swap-position">
            <ion-icon name="swap-horizontal-outline"></ion-icon>
          </div>
        </div>
        <div className="card output-wrapper">
          <div className="to">
            <span className="heading">To :</span>
          <div className="dropdown-container" id="output-language">
            <div className="dropdown-toggle">
              <ion-icon name="globe-outline"></ion-icon>
              <span className="selected" data-value="en">English</span>
              <ion-icon name="chevron-down-outline"></ion-icon>
            </div>
            <ul className="dropdown-menu">
              <li className="option active">DropDown Menu Item 1</li>
              <li className="option">DropDown Menu Item 2</li>
            </ul>
          </div>
        </div>
        <textarea id="output-text" cols="30" rows="10" placeholder="Translated text will appear here" disabled></textarea>
        <div className="card-bottom">
          <p>Download as a document!</p>
          <button id="download-btn">
            <span>Download</span>
            <ion-icon name="cloud-download-outline"></ion-icon>
          </button>
        </div>
      </div>
    </div>
  </>
  )
}

export default App
