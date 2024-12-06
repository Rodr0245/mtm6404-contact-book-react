import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, addDoc } from "firebase/firestore";
import db from "../db";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


function NewContact() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "Contacts"), {
        firstName,
        lastName,
        email,
        imageLink: profilePicture,
        tags
      });

      navigate(`/contact/${docRef.id}`);
    } catch (error) {
      console.error("Error adding contact: ", error);
    }
  };

  const handleTagClick = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

	// Used to display a placeholder image if no user image is provided
	const placeholderImage = "https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png"

  return (
    <div className="bg-darkBackground min-h-screen flex justify-center md:items-center motion-bg-in-background motion-delay-200 ">
      <div className="m-4 lg:m-0 px-4 md:px-8 py-8 max-w-md md:max-w-3xl lg:max-w-7xl w-full bg-background rounded-3xl backdrop-blur-lg motion-preset-blur-up-md motion-delay-75 h-full" tabIndex={-1}>
				<div className="flex justify-between items-center mb-8 focus:outline-none " aria-label="Cancel">
        	<h1 className="text-xl text-white font-normal">// Create Contact</h1>
						<button onClick={() => {
							const confirmCancel = window.confirm("Are you sure you want to cancel?");
							if (confirmCancel) {
								navigate(`/`);
							}}}
							className="bg-transparent border border-zinc-700 hover:bg-zinc-700 text-white px-3 py-[7px] rounded-full text-sm transition ease duration-300" title="Cancel" aria-label="Cancel">
          	<FontAwesomeIcon icon={faXmark}/>
        	</button>
				</div>
					{/* Mobile Preview Card */}
						<div className="md:hidden previewCard flex items-center w-full rounded-2xl p-4 gap-2 focus:outline-none  transition ease duration-300 cursor-default my-8 " role="button" aria-label="Preview Card" title={firstName || lastName ? `${firstName} ${lastName}` : "Your Contact"}>
							<div className="previewPicture w-[100px] h-[100px] overflow-hidden rounded-full">
							<div className="h-full w-full bg-cover bg-center bg-no-repeat">
								<img
									className={`w-full h-full object-cover object-center rounded-full ${
										profilePicture ? "motion-preset-blur-up-md motion-duration-[1200ms]" : ""
									}`}
									src={profilePicture ? profilePicture : placeholderImage}
									alt=""
								/>
							</div>
							</div>
							<div className="previewDetails text-white space-y-1">

							<p className="previewName font-normal max-w-[220px] text-2xl ">
								{firstName.split("").map((letter, index) => (
									<span key={index} className="motion-preset-blur-up">{letter}</span>
								))}
								{" "}
								{lastName.split("").map((letter, index) => (
									<span key={index} className="motion-preset-blur-up">{letter}</span>
								))}
							</p>
							<p className="previewEmail text-sm text-zinc-400 max-w-[220px] flex flex-wrap">{email.split("").map((letter, index) => (
									<span key={index} className="motion-preset-blur-up">{letter}</span>
								))}
								{" "}</p>
							<p className="previewTags !mt-3 flex gap-2 max-w-[200px] flex-wrap">
								{tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full cursor-pointer transition duration-300 ease text-white text-sm py-1 px-2 bg-zinc-700 hover:bg-zinc-900 focus:bg-zinc-900 focus:outline-none motion-preset-blur-up"
									onClick={() => handleTagClick(tag)}
									role="button" aria-label="Tag"
								>
									{tag}
								</span>
								))}
							</p>
							</div>							
						</div>
				{/* Desktop Preview Card */}
						<div className="hidden md:flex previewCard items-center rounded-2xl p-8 gap-4 lg:gap-8 focus:outline-none transition ease duration-300 cursor-default my-8 w-full mx-auto " role="button" aria-label="Preview Card" title="Your Contact">
							<div className="previewPicture w-[200px] lg:w-[300px] h-[200px] lg:h-[300px] overflow-hidden rounded-full">
							<div className="h-full w-full bg-cover bg-center bg-no-repeat">
								<img
									className={`w-full h-full object-cover object-center rounded-full ${
										profilePicture ? "motion-preset-blur-up-md motion-duration-[1200ms]" : ""
									}`}
									src={profilePicture ? profilePicture : placeholderImage}
									alt=""
								/>
							</div>
							</div>
							<div className="h-full w-[1px] bg-zinc-700 my-2"></div>
							<div className="previewDetails text-white space-y-1">

							<p className="previewName font-normal max-w-[400px] lg:max-w-[600px] text-4xl lg:text-6xl">
								{firstName.split("").map((letter, index) => (
									<span key={index} className="motion-preset-blur-up">{letter}</span>
								))}
								{" "}
								{lastName.split("").map((letter, index) => (
									<span key={index} className="motion-preset-blur-up">{letter}</span>
								))}
							</p>
							<p className="previewEmail text-md lg:text-xl text-zinc-400 max-w-[300px] lg:max-w-[600px] overflow-x-auto">{email.split("").map((letter, index) => (
									<span key={index} className="motion-preset-blur-up">{letter}</span>
								))}
								{" "}</p>
							<p className="previewTags !mt-3 flex gap-2 max-w-[400px] lg:max-w-[600px] flex-wrap">
								{tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full cursor-pointer transition duration-300 ease text-white text-sm lg:text-lg py-1 px-2 bg-zinc-700 hover:bg-zinc-900 focus:bg-zinc-900 focus:outline-none motion-preset-blur-up"
									onClick={() => handleTagClick(tag)}
									role="button" aria-label="Tag"
								>
									{tag}
								</span>
								))}
							</p>
							</div>							
						</div>
        <form onSubmit={handleSubmit}>
					<div className="contactDetailsContainer flex flex-wrap gap-6 sm:gap-x-0">
						<div className="contactDetails flex flex-col w-full sm:w-1/2 sm:pr-2 gap-2 focus:outline-none" role="button" aria-label="First Name">
							<label className="text-xs text-white" htmlFor="firstName">// First Name :</label>
							<input
								type="text"
								value={firstName}
								// Character limit logic
								onChange={(e) => setFirstName(e.target.value.slice(0, 20))}
								required
								className="p-2 rounded-full bg-transparent border border-zinc-700 text-white outline-none focus:border-zinc-500 transition ease duration-300 placeholder:text-zinc-500 placeholder:text-xs hover:border-zinc-500"
								placeholder="John"
								id="firstName"
								aria-labelledby="firstName"
								maxLength={20}
							/>
							</div>
							<div className="contactDetails flex flex-col w-full sm:w-1/2 sm:pl-2 gap-2 focus:outline-none" role="button" aria-label="Last Name">
								<label className="text-xs text-white" htmlFor="lastName">// Last Name :</label>
								<input
									type="text"
									value={lastName}
									onChange={(e) => setLastName(e.target.value.slice(0, 20))}
									required
									className="p-2 rounded-full bg-transparent border border-zinc-700 text-white outline-none focus:border-zinc-500 transition ease duration-300 placeholder:text-zinc-500 placeholder:text-xs hover:border-zinc-500"
									placeholder="Doe"
									id="lastName"
									aria-labelledby="lastName"
									maxLength={20}
								/>
							</div>
							<div className="contactDetails flex flex-col w-full sm:w-1/2 sm:pr-2 gap-2 focus:outline-none" role="button" aria-label="Email">
								<label className="text-xs text-white" htmlFor="email">// Email :</label>
								<input
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="p-2 rounded-full bg-transparent border border-zinc-700 text-white outline-none focus:border-zinc-500 transition ease duration-300 placeholder:text-zinc-500 placeholder:text-xs hover:border-zinc-500"
									placeholder="johndoe@hotmail.com"
									id="email"
									aria-labelledby="email"
								/>
							</div>
							<div className="contactDetails flex flex-col w-full sm:w-1/2 sm:pl-2 gap-2 focus:outline-none" role="button" aria-label="Profile Picture (URL)">
								<label className="text-xs text-white" htmlFor="profilePicture">// Profile Picture (URL) :</label>
								<input
									type="url"
									value={profilePicture}
									onChange={(e) => setProfilePicture(e.target.value)}
									className="p-2 rounded-full bg-transparent border border-zinc-700 text-white outline-none focus:border-zinc-500 transition ease duration-300 placeholder:text-zinc-500 placeholder:text-xs hover:border-zinc-500"
									placeholder="// Optional"
									title="Paste a URL to a profile picture"
									id="profilePicture"
									aria-labelledby="profilePicture"
								/>
							</div>
						<div className="tagContainer flex flex-col gap-2 focus:outline-none" role="button" aria-label="Tags">
            	<label className="text-white text-xs" htmlFor="tags">// Tags :</label>
            	<div className="flex flex-wrap select-none gap-2">
              {["friends", "family", "work", "other"].map((tag) => (
                <span
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={` rounded-full  cursor-pointer transition duration-300 ease text-white py-1 px-3 bg-zinc-700 hover:bg-zinc-900 focus:bg-zinc-900 focus:outline-none ${
                    tags.includes(tag) ? "!bg-green-500" : ""
                  }`}
                  role="button" aria-label={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
						</div>
          </div>
					<div className="btnGroup flex justify-between flex-wrap focus:outline-none" aria-label="Cancel or Create Contact">
						<div className="h-[1px] w-full bg-zinc-700 my-8" ></div>
						<a onClick={() => {
							const confirmCancel = window.confirm("Are you sure you want to cancel?");
							if (confirmCancel) {
								navigate(`/`);
							}
						}} className="bg-transparent border border-zinc-700 hover:bg-zinc-700 text-white font-semibold py-3 px-4 rounded-full text-sm transition ease duration-300 focus:bg-zinc-700 focus:outline-none cursor-pointer" title="Cancel" aria-label="Cancel">
						Cancel
						</a>
						<button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-full text-sm transition ease duration-300 focus:bg-blue-500 focus:outline-none" title="Create Contact" aria-label="Create Contact">Create Contact</button>
						</div>
        </form>
      </div>
    </div>
  );
}

export default NewContact;

