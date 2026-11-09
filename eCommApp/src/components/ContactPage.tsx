import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [request, setRequest] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setName('');
        setEmail('');
        setRequest('');
        setShowConfirmation(true);
    };

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <section className="contact-container">
                    <h2>Contact Us</h2>
                    <form className="contact-form" onSubmit={handleSubmit}>
                        <label htmlFor="contact-name">Name</label>
                        <input
                            id="contact-name"
                            type="text"
                            value={name}
                            onChange={event => setName(event.target.value)}
                            required
                        />
                        <label htmlFor="contact-email">Email</label>
                        <input
                            id="contact-email"
                            type="email"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            required
                        />
                        <label htmlFor="contact-request">Request</label>
                        <textarea
                            id="contact-request"
                            value={request}
                            onChange={event => setRequest(event.target.value)}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                </section>
            </main>
            <Footer />
            {showConfirmation && (
                <div className="modal-backdrop">
                    <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="contact-confirmation">
                        <p id="contact-confirmation">Thank you for your message.</p>
                        <button type="button" onClick={() => setShowConfirmation(false)}>Continue</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContactPage;
