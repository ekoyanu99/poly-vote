import Navbar from "../components/navigation/navbar";
import Footer from "../components/navigation/footer";

export default function MainLayout({ children }) {
	return (
		<div className="min-h-screen gradient-bg-welcome">
            <Navbar />
            {children}
			<Footer />
		</div>
	);
}
