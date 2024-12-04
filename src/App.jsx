import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ContactList from "./components/ContactList";
import ContactDetails from "./components/ContactDetails";
import NewContact from "./components/NewContact";
import EditContact from "./components/EditContact";
import React from "react";

// App without animated routes
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/contact/:id" element={<ContactDetails />} />
        <Route path="/new-contact" element={<NewContact />} />
        <Route path="/edit-contact/:id" element={<EditContact />} />
      </Routes>
    </Router>
  );
}

export default App;

