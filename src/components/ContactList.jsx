// src/components/ContactList.js

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar, faPlus, faFilter } from "@fortawesome/free-solid-svg-icons";
import db from "../db";

function ContactList() {
  // Stores contacts fetched from Firestore
  const [contacts, setContacts] = useState([]);
  // Stores the search term entered by the user
  const [searchTerm, setSearchTerm] = useState("");
  // Stores the selected tag
  const [selectedTag, setSelectedTag] = useState("");
  // Stores the contacts marked as favorites
  const [favoredContacts, setFavoredContacts] = useState({});
  // Toggles showing only favorite contacts
  const [showFavorites, setShowFavorites] = useState(false);
  // Toggles the tag dropdown visibility
  const [showTagDropdown, setShowTagDropdown] = useState(false); // Controls dropdown visibility

  useEffect(() => {
    // Fetches contacts from Firestore
    const fetchContacts = async () => {
      try {
        const contactsRef = collection(db, "Contacts");
        const contactsSnapshot = await getDocs(contactsRef);
        const contactsData = contactsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const sortedContacts = contactsData.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        );
        setContacts(sortedContacts);
        const favoredContactsData = sortedContacts.filter((doc) => doc.favorite);
        const favoredContactsObj = {};
        favoredContactsData.forEach((doc) => {
          favoredContactsObj[doc.id] = true;
        });
        setFavoredContacts(favoredContactsObj);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);
  // Stores placeholder image URL
  const placeholderImage = "https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png";


  // Handles search input
  const handleSearch = (e) => setSearchTerm(e.target.value);

  // Filters contacts based on search term
  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.firstName} ${contact.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handles tag selection
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setShowTagDropdown(false); // Hide dropdown after selecting a tag
  };

  // Filters contacts based on selected tag
  const filteredByTag = filteredContacts.filter((contact) => {
    if (selectedTag === "all" || selectedTag === "") return true;
    return contact.tags && contact.tags.includes(selectedTag);
  });

  // Groups contacts by first letter of last name
  const groupedContacts = {};
  filteredByTag.forEach((contact) => {
    const firstLetter = contact.lastName[0].toUpperCase();
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }
    groupedContacts[firstLetter].push(contact);
  });

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

  // Toggles showing only favorite contacts
  const handleShowFavorites = () => setShowFavorites(!showFavorites);

  // Filters contacts based on showFavorites toggle
  const filteredContactsToShow = showFavorites
    ? filteredByTag.filter((contact) => favoredContacts[contact.id])
    : filteredByTag;

  const navigate = useNavigate();  // Hook to programmatically navigate


  // Loads contact preview card on hover

  const handlePreviewHover = (contact) => {
    const previewCard = document.getElementById(`preview-card-${contact.id}`);
    if (previewCard) {
      previewCard.style.display = "block";
    }
  };

  const handlePreviewLeave = (contact) => {
    const previewCard = document.getElementById(`preview-card-${contact.id}`);
    if (previewCard) {
      previewCard.style.display = "none";
    }
  };

  return (
    <div className="mx-auto px-2 md:px-6 lg:px-8 md:max-w-6xl">
      {/* Header */}
      <section className="bg-darkBackground rounded-3xl px-8 py-4 flex flex-col md:flex-row items-center mt-2">
        <div classList="logo">
          <h1 className="font-black text-2xl md:text-5xl text-gray-300 pb-4 md:pb-0">CONTACTS</h1>
        </div>
        {/* Control Section */}
        <section className="controlSection flex items-center gap-1.5  mx-auto md:w-1/2  ">
          {/* Search Bar */}
          <div className="searchBoxContainer relative w-full" title="Search">
            <input
              type="text"
              className="search-box rounded-full p-3 pl-10 border border-zinc-800 bg-transparent w-full text-white outline-none hover:border-zinc-500 focus:border-zinc-500 transition ease duration-300 placeholder:text-zinc-500"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500"
            />
          </div>
          <div className="btnGroup flex gap-1.5">
            {/* Tag Filter Button */}
            <div className="tagsFilterBtn relative">
              <button
                className="px-5 py-4 border border-zinc-800 text-md rounded-full focus:bg-green-500 hover:bg-green-500 transition ease duration-300"
                onClick={() => setShowTagDropdown(!showTagDropdown)}
              >
                <FontAwesomeIcon icon={faFilter} className="text-white" />
              </button>
              {showTagDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10 motion-preset-blur-up">
                  <ul>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition ease duration-300"
                      onClick={() => handleTagSelect("all")}
                    >
                      All
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition ease duration-300"
                      onClick={() => handleTagSelect("friends")}
                    >
                      Friends
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition ease duration-300"
                      onClick={() => handleTagSelect("family")}
                    >
                      Family
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition ease duration-300"
                      onClick={() => handleTagSelect("work")}
                    >
                      Work
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => handleTagSelect("other")}
                    >
                      Other
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Favorites Button */}
            <div className="favoritesBtn cursor-pointer px-[18px] py-4 border border-zinc-800 text-md rounded-full focus:bg-green-500 hover:bg-green-500 transition ease duration-300" onClick={handleShowFavorites}>
              <FontAwesomeIcon
                icon={faStar}
                className={showFavorites ? "text-green-500" : "text-white"}
              />
            </div>

            {/* New contact Button */}
            <Link to="/new-contact">
              <button className="cursor-pointer px-5 py-4 border border-zinc-800 text-md rounded-full hover:bg-green-500 focus:bg-green-500 transition ease duration-300">
                <FontAwesomeIcon icon={faPlus} className="text-white" />
              </button>
            </Link>
          </div>

        </section>
      </section>
      {/* Contact List */}
      <section className="bg-darkBackground rounded-3xl py-6 my-2 mx-auto px-6 lg:px-8">
        <p className="text-zinc-600 font-normal mb-8">Displayed Contacts: {filteredContactsToShow.length}</p>
        {Object.keys(groupedContacts).sort().map((letter) => (
          <div key={letter}>
            {filteredContactsToShow.filter((contact) => contact.lastName[0].toUpperCase() === letter)
              .length > 0 && (
              <div className="relative">
                <h2 className="text-xs font-medium text-zinc-600 absolute top-0 left-0 transform translate-y-[-100%]">{letter}</h2>
                  <ul>
                  {filteredContactsToShow.filter((contact) => contact.lastName[0].toUpperCase() === letter)
                    .map((contact) => (
                      <div key={contact.id} onClick={() => navigate(`/contact/${contact.id}`)} classList="relative">
                        {/* PREVIEW CARD */}
                        <div id={`preview-card-${contact.id}`} className="hidden text-white absolute -top-32 right-80 w-[400px] h-auto z-50 bg-background/50 backdrop-blur-3xl rounded-3xl p-8 motion-preset-blur-up-lg space-y-8">
                          <div className="h-full w-full bg-cover bg-center bg-no-repeat flex justify-center ">
                            <img
                              className={`w-40 h-40 object-cover object-center rounded-full ${
                                contact.imageLink ? "motion-preset-blur-up-md motion-duration-[1200ms]" : ""
                              }`}
                              src={contact.imageLink ? contact.imageLink : placeholderImage}
                              alt=""
                            />
                          </div>
                          <div className="contactDetails text-white space-y-1 flex flex-col justify-center items-center">
                            <p className="contactName font-normal text-2xl md:text-3xl overflow-auto md:overflow-visible text-center line-clamp-2">
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
                              <span className={favoredContacts[contact.id] ? "hover:bg-green-800 bg-green-500 rounded-full transition duration-300 ease text-white motion-preset-blur-up text-sm py-1 px-2 md:text-md lg:text-lg cursor-pointer" : "hidden"} title="unfavorite" onClick={() => handleFavoriteClick(contact)}>Favorited</span>
                            </p>
                          </div>	
                        </div>
                        {/* Contact List Container */}
                        <li className="contactContainer flex items-center justify-between gap-3 py-3 px-3 my-4 hover:bg-green-500 transition ease duration-300 rounded-full cursor-pointer motion-preset-blur-up-md" title={contact.firstName + " " + contact.lastName}>
                          {/* Contact Container */}
                          <div className="contactData flex gap-4 items-center" onMouseOver={() => handlePreviewHover(contact)} onMouseLeave={() => handlePreviewLeave(contact)}>
                            {/* Contact Image */}
                            <div className="imageContainer bg-cover bg-center bg-no-repeat">
                              <img
                                className={`w-14 h-14 object-cover object-center rounded-full ${
                                  contact.imageLink
                                }`}
                                src={contact.imageLink ? contact.imageLink : placeholderImage}
                                alt=""
                              />
                            </div>
                            {/* Contact Details */}
                            <div className="contactDetails">
                              <p className="font-extralight text-gray-200 text-lg">
                                {contact.lastName} {contact.firstName}
                              </p>
                            </div>
                          </div>
                          {/* Favorite Button */}
                          <button
                            title="Favorite"
                            className={favoredContacts[contact.id] ? " bg-green-500 rounded-full px-3 py-[9px] md:px-4 md:py-3 transition ease duration-300 text-white md:text-lg" : "text-zinc-700 rounded-full transition ease duration-300 px-3 py-[9px] md:px-4 md:py-3 hover:scale-110 hover:bg-green-500 hover:text-white md:text-lg z-0"}
                            onClick={(event) => {
                              event.stopPropagation();  // Prevent the click event from propagating to the parent div
                              handleFavoriteClick(contact);  // Handle the favorite logic
                            }}
                          >
                            <FontAwesomeIcon icon={faStar} />
                          </button>
                        </li>
                      </div>
                    ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default ContactList;
