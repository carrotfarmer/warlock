import React from "react";

export const LandingPage: React.FC = ({}) => {
  return (
    <div className="pt-3">
      <div className="flex justify-center">
        <div className="max-w-4xl">
          <h1 className="text-7xl font-extrabold text-purple-200">
            <p className="bg-gradient-to-r from-purple-200 to-purple-500 bg-clip-text py-3 text-transparent">
              password management.
            </p>
            <p>
              as <span className="text-green-200 underline underline-offset-4">secure</span> as it
              gets.
            </p>
            <p>
              as <span className="text-blue-200 underline underline-offset-4">simple</span> as it
              gets.
            </p>
          </h1>
        </div>
      </div>
      <div>
      </div>
    </div>
  );
};
