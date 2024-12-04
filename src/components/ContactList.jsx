// src/components/ContactList.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faStar, faPlus, faFilter } from "@fortawesome/free-solid-svg-icons";
import db from "../db";

function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [favoredContacts, setFavoredContacts] = useState({});
  const [showFavorites, setShowFavorites] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false); // Controls dropdown visibility

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Contacts"));
        const contactsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const sortedContacts = contactsData.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        );

        setContacts(sortedContacts);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.firstName} ${contact.lastName}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleUserImage = (contact) => {
    const placeholderImage = "https://imebehavioralhealth.com/wp-content/uploads/2021/10/user-icon-placeholder-1.png";
    return (
      <img
        src={contact.imageLink || placeholderImage}
        alt={`${contact.firstName} ${contact.lastName}`}
      />
    );
  };

  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
    setShowTagDropdown(false); // Hide dropdown after selecting a tag
  };

  const filteredByTag = filteredContacts.filter((contact) => {
    if (selectedTag === "all" || selectedTag === "") return true;
    return contact.tags && contact.tags.includes(selectedTag);
  });

  const groupedContacts = {};
  filteredByTag.forEach((contact) => {
    const firstLetter = contact.lastName[0].toUpperCase();
    if (!groupedContacts[firstLetter]) {
      groupedContacts[firstLetter] = [];
    }
    groupedContacts[firstLetter].push(contact);
  });

  const handleFavoriteClick = async (contact) => {
    const contactRef = doc(db, "Contacts", contact.id);
    try {
      const contactDoc = await getDoc(contactRef);
      const isFavorited = contactDoc.data().favorite;
      await updateDoc(contactRef, { favorite: !isFavorited });
      setFavoredContacts((prevState) => ({
        ...prevState,
        [contact.id]: !isFavorited
      }));
    } catch (error) {
      console.error("Error favoriting contact:", error);
    }
  };

  const handleShowFavorites = () => setShowFavorites(!showFavorites);

  const filteredContactsToShow = showFavorites
    ? filteredByTag.filter((contact) => favoredContacts[contact.id])
    : filteredByTag;

  return (
    <div className="bg-background max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <p className="text-zinc-600 font-normal">Displayed Contacts: {filteredContactsToShow.length}</p>
      <section className="controlSection flex items-center">
				{/* Search Bar */}
        <div className="searchBoxContainer relative w-2/3">
          <input
            type="text"
            className="search-box rounded-full p-3 pl-10 border border-zinc-700 bg-transparent w-full text-white outline-none hover:border-zinc-500 focus:border-zinc-500 transition ease duration-300 placeholder:text-zinc-500"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500"
          />
        </div>
				<div className="btnGroup flex">
        {/* Tag Filter Button */}
					<div className="relative">
						<button
							className="px-4 py-3.5 border border-zinc-700 text-sm rounded-full focus:bg-blue-500 hover:bg-blue-500 transition ease duration-300"
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
					<div className="cursor-pointer px-4 py-3.5 border border-zinc-700 text-sm rounded-full focus:bg-blue-500 hover:bg-blue-500 transition ease duration-300" onClick={handleShowFavorites}>
						<FontAwesomeIcon
							icon={faStar}
							className={showFavorites ? "text-green-400" : "text-white"}
						/>
					</div>

					{/* New contact Button */}
					<Link to="/new-contact">
						<button className="cursor-pointer px-4 py-3.5 bg-blue-500 text-sm rounded-full focus:bg-blue-600 hover:bg-blue-600 transition ease duration-300">
							<FontAwesomeIcon icon={faPlus} className="text-white" />
						</button>
					</Link>
				</div>

      </section>

      {Object.keys(groupedContacts).sort().map((letter) => (
        <div key={letter}>
          {filteredContactsToShow.filter((contact) => contact.lastName[0].toUpperCase() === letter)
            .length > 0 && (
            <div>
              <h2 className="text-xs font-bold">{letter}</h2>
              <ul>
                {filteredContactsToShow.filter((contact) => contact.lastName[0].toUpperCase() === letter)
                  .map((contact) => (
                  <li key={contact.id}>
                    <Link to={`/contact/${contact.id}`}>
                      <div className="contactContainer flex items-center gap-3 my-4">
                        <div className="contactImage w-20 h-20 rounded-full overflow-hidden bg-cover bg-center bg-no-repeat flex items-center justify-center">
                          {handleUserImage(contact)}
                        </div>
                        <div className="contactDetails">
                          <p>
                            {contact.lastName} {contact.firstName}
                            {favoredContacts[contact.id] && (
                              <span className="text-green-500"> (Favorite)</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </Link>
                    <button
                      className={favoredContacts[contact.id] ? "bg-green-400" : ""}
                      onClick={() => handleFavoriteClick(contact)}
                    >
                      Favorite
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ContactList;
