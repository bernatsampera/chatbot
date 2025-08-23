import {useEffect, useState} from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [active, setActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8008/api/v1/hello")
      .then((res) => setInput(res.data.message))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation */}
      <div className="navbar bg-base-200 shadow-sm">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl text-base-content">
            Silent Edge
          </a>
        </div>
        <div className="flex-none">
          <button className="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block w-5 h-5 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h.01M12 12h.01M19 12h.01m-7 5a2 2 0 100-4 2 2 0 000 4zm6-3a2 2 0 100-4 2 2 0 000 4z"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-8">
        <div className="hero bg-base-100 py-16">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold text-base-content">
                Silent Edge
              </h1>
              <p className="py-6 text-base-content/70">
                Testing DaisyUI components with our custom theme. Response from
                backend: <span className="font-mono text-sm">{input}</span>
              </p>
              <button
                className="btn btn-primary mr-4"
                onClick={() => setActive(!active)}
              >
                Toggle Demo
              </button>
              <button className="btn btn-secondary">Secondary Action</button>
            </div>
          </div>
        </div>

        {active && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {/* Card Examples */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base-content">Card Title</h2>
                <p className="text-base-content/70">
                  This is a card component with Silent Edge styling.
                </p>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary btn-sm">Action</button>
                </div>
              </div>
            </div>

            {/* Form Elements */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base-content">Form Elements</h2>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-base-content">
                      Input Field
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                </div>
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text text-base-content">Select</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                  >
                    <option disabled value="">
                      Pick one
                    </option>
                    <option value="option1">Option 1</option>
                    <option value="option2">Option 2</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Button Variations */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base-content">Buttons</h2>
                <div className="space-y-2">
                  <button className="btn btn-primary w-full">Primary</button>
                  <button className="btn btn-secondary w-full">
                    Secondary
                  </button>
                  <button className="btn btn-accent w-full">Accent</button>
                  <button className="btn btn-neutral w-full">Neutral</button>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base-content">Alerts</h2>
                <div className="space-y-2">
                  <div className="alert alert-info">
                    <span>Info message</span>
                  </div>
                  <div className="alert alert-success">
                    <span>Success message</span>
                  </div>
                  <div className="alert alert-warning">
                    <span>Warning message</span>
                  </div>
                  <div className="alert alert-error">
                    <span>Error message</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress and Loading */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base-content">
                  Progress & Loading
                </h2>
                <div className="space-y-4">
                  <progress
                    className="progress progress-primary w-full"
                    value="70"
                    max="100"
                  ></progress>
                  <div className="flex justify-center">
                    <span className="loading loading-spinner loading-md"></span>
                  </div>
                  <div className="badge badge-primary">Badge</div>
                  <div className="badge badge-secondary">Secondary</div>
                </div>
              </div>
            </div>

            {/* Toggle and Checkbox */}
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <h2 className="card-title text-base-content">
                  Toggles & Checks
                </h2>
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text text-base-content">
                        Toggle
                      </span>
                      <input
                        type="checkbox"
                        className="toggle toggle-primary"
                        defaultChecked
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text text-base-content">
                        Checkbox
                      </span>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-primary"
                        defaultChecked
                      />
                    </label>
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text text-base-content">
                        Radio
                      </span>
                      <input
                        type="radio"
                        name="radio-1"
                        className="radio radio-primary"
                        defaultChecked
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded mt-16">
          <div>
            <p className="text-base-content/70">
              Silent Edge Design System - DaisyUI Theme Testing
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
