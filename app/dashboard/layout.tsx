import Subheader from '@/components/Dashboard/Subheader/Subheader';
import Header from '@/components/Header';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<Header />
			<Subheader />
			<div>{children}</div>
		</div>
	);
}
