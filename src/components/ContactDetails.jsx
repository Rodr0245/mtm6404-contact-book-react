// src/components/ContactDetails.js

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import db from "../db"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { faStar } from "@fortawesome/free-solid-svg-icons";

function ContactDetails() {
  const { id } = useParams(); 
  const [contact, setContact] = useState(null);
	const [favoredContacts, setFavoredContacts] = useState({});
	const navigate = useNavigate();

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const docRef = doc(db, "Contacts", id); 
        const docSnap = await getDoc(docRef); 

        if (docSnap.exists()) {
          setContact({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such contact!");
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
      }
    };

    fetchContact();
  }, [id]); 

  useEffect(() => {
    const fetchFavoredContacts = async () => {
      try {
        const contactsRef = collection(db, "Contacts");
        const contactsSnapshot = await getDocs(contactsRef);
        const favoredContactsData = contactsSnapshot.docs.filter((doc) => doc.data().favorite);
        const favoredContactsObj = {};
        favoredContactsData.forEach((doc) => {
          favoredContactsObj[doc.id] = true;
        });
        setFavoredContacts(favoredContactsObj);
      } catch (error) {
        console.error("Error fetching favored contacts:", error);
      }
    };

    fetchFavoredContacts();
  }, []);

  if (!contact) return <p>Loading...</p>;

	const placeholderImage = "https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png";
	const handleUserImage = (contact) => {

	return contact.imageLink ? (
		<img src={contact.imageLink} alt={`${contact.firstName} ${contact.lastName}`} />
		) : (
		<img src={placeholderImage} alt="No user image" />
		);
	};

		// Handles favorite selection
	const handleFavoriteClick = async (contact) => {
  const contactRef = doc(db, "Contacts", contact.id);
  try {
    const contactDoc = await getDoc(contactRef);
    const isFavorited = contactDoc.data().favorite;
    await updateDoc(contactRef, {
      favorite: !isFavorited,
    });
    setFavoredContacts((prevState) => ({
      ...prevState,
      [contact.id]: !isFavorited
    }));
    console.log(`Contact ${isFavorited ? "unfavorited" : "favorited"} successfully`);
  } catch (error) {
    console.error("Error favoriting contact:", error);
  }
};

  return (
		<div className="bg-darkBackground min-h-screen flex justify-center md:items-center motion-bg-in-background motion-delay-200 ">
      <div className="m-4 lg:m-0 px-4 md:px-8 py-8 max-w-md md:max-w-3xl w-full bg-background rounded-3xl backdrop-blur-lg motion-preset-blur-up-md motion-delay-75 h-full" tabIndex={-1}>
				<div className="flex justify-between items-center mb-8 focus:outline-none " aria-label="Cancel">
        	<h1 className="text-xl text-white font-normal">{"// " + contact.firstName + " " + contact.lastName}</h1>
						<button onClick={() => navigate("/")}
							className="bg-transparent border border-zinc-700 hover:bg-zinc-700 text-white px-3 py-[7px] md:px-3.5 rounded-full text-sm md:text-2xl transition ease duration-300" title="Cancel" aria-label="Cancel">
          	<FontAwesomeIcon icon={faXmark}/>
        	</button>
				</div>
					{/* Contact Card */}
						<div className="contactCard flex flex-col items-center w-full rounded-2xl p-4 gap-8 focus:outline-none transition ease duration-300 cursor-default my-8 " role="button" aria-label="Contact Card" title={contact.firstName + " " + contact.lastName}>
							<div className={favoredContacts[contact.id] ? "contactPicture w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] overflow-hidden bg-green-400 p-4 transition ease duration-300 relative" : "contactPicture w-[200px] h-[200px] md:w-[300px] md:h-[300px] lg:w-[400px] lg:h-[400px] bg-transparent p-4 transition ease duration-300 relative overflow-visible"} style={{ borderRadius: "100% 70px 100% 100% "}}>
								<button title="Favorite" className={favoredContacts[contact.id] ? "bg-green-400 absolute top-0 right-0 rounded-full px-4 py-3 transition-[background,transform] ease duration-300 transform-scale-105 text-white md:text-xl md:-translate-x-1 md:translate-y-1 lg:text-2xl lg:-translate-x-3 lg:translate-y-3" : "translate-x-4 text-zinc-700 border rounded-full transition-[background,transform] ease duration-300 absolute top-0 right-0 px-3 py-2.5 md:text-2xl border-zinc-700 hover:scale-110 hover:bg-green-400 hover:text-white"} onClick={() => handleFavoriteClick(contact)}><FontAwesomeIcon icon={faStar}/></button>
							<div className="h-full w-full bg-cover bg-center bg-no-repeat">
								<img
									className={`w-full h-full object-cover object-center rounded-full ${
										contact.imageLink ? "motion-preset-blur-up-md motion-duration-[1200ms]" : ""
									}`}
									src={contact.imageLink ? contact.imageLink : placeholderImage}
									alt=""
								/>
							</div>
							</div>
							<div className="contactDetails text-white space-y-1 flex flex-col justify-center items-center">
							<p className="contactName font-normal text-2xl md:text-3xl lg:text-5xl overflow-auto md:overflow-visible text-center">
								{contact.firstName} {contact.lastName}
							</p>
							<p className="contactEmail text-sm text-zinc-400 max-w-[250px] lg:max-w-[400px] justify-center w-full flex flex-wrap lg:text-xl md:text-lg">{contact.email}</p>
							<p className="contactTags !mt-3 flex gap-2 max-w-[400px] lg:max-w-full flex-wrap justify-center">
								{contact.tags.map((tag) => (
								<span
									key={tag}
									className="rounded-full transition duration-300 ease text-white text-sm py-1 px-2 bg-zinc-700 hover:bg-zinc-900 focus:bg-zinc-900 focus:outline-none md:text-md lg:text-lg"
									aria-label="Tag">{tag}
								</span>
								))}
								<span className={favoredContacts[contact.id] ? "hover:bg-transparent hover:border hover:border-zinc-700 bg-green-400 rounded-full transition duration-300 ease text-white motion-preset-blur-up text-sm py-1 px-2 md:text-md lg:text-lg cursor-pointer" : "hidden"} title="unfavorite" onClick={() => handleFavoriteClick(contact)}>Favorited</span>
							</p>
							</div>	
								<div className="flex justify-center mt-4 space-x-4">
								{/* Edit button */}
								<Link to={`/edit-contact/${id}`}>
									<button className="bg-transparent border border-zinc-700 hover:bg-zinc-700 text-white font-semibold py-3 px-4 rounded-full text-sm transition ease duration-300 focus:bg-zinc-700 focus:outline-none cursor-pointer"
										role="link"
										aria-label="Edit Contact"
										title="Edit Contact">
										Edit Contact
									</button>
								</Link>
							</div>
						</div>
				</div>
			</div>
  );
}

export default ContactDetails;

