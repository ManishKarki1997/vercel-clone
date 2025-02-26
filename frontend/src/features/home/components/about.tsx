import React from 'react'

function About() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col justify-center">
        <p
          className="self-start inline font-sans text-xl font-medium text-transparent bg-clip-text bg-gradient-to-br from-green-400 to-green-600">
          Simple and easy
        </p>
        <h2 className="text-4xl font-bold">Made for Devs and Designers</h2>
        <div className="h-6"></div>
        <p className="font-serif text-xl text-gray-400 md:pr-10">
          Just upload your Vite project, and we&apos;ll handle the rest. No hassle, no stress—just get your app live in minutes!
        </p>
        <div className="h-8"></div>
        <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-800">
          <div>
            <p className="font-semibold text-gray-400">Made with love</p>
            <div className="h-4"></div>
            <p className="font-serif text-gray-400">
              We built this because we know how annoying deployments can be. It&apos;s simple, quick, and designed with care—just for you.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-400">It's easy to build</p>
            <div className="h-4"></div>
            <p className="font-serif text-gray-400">
              Throw your Vite project our way, and we&apos;ll do all the setup and deploying for you. It&apos;s as easy as it gets—just build and deploy, done!
            </p>
          </div>
        </div>
      </div>
      <div>
        <div className="-mr-24 rounded-lg md:rounded-l-full bg-gradient-to-br from-gray-900 to-black h-96"></div>
      </div>
    </div>

  )
}

export default About