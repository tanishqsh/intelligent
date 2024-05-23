import toast from 'react-hot-toast';
import toastStyles from '../../../utils/toastStyles';

const copyAllAddresses = (type: string, array: any[]) => {
	let addresses: string[] = []; // Ensure addresses is initialized

	if (type === 'likes') {
		addresses = Array.from(
			new Set(
				array
					.map((like) => {
						const connectedWalletAddress =
							like?.reactedBy?.connectedAddresses &&
							like.reactedBy.connectedAddresses.length > 0 &&
							like.reactedBy.connectedAddresses[0].blockchain === 'ethereum'
								? like.reactedBy.connectedAddresses[0].address
								: null;
						return connectedWalletAddress;
					})
					.filter((address) => address !== null) // Filter out null addresses
			)
		);
	} else if (type === 'recasts') {
		addresses = Array.from(
			new Set(
				array
					.map((recast) => {
						const connectedWalletAddress =
							recast?.reactedBy?.connectedAddresses &&
							recast.reactedBy.connectedAddresses.length > 0 &&
							recast.reactedBy.connectedAddresses[0].blockchain === 'ethereum'
								? recast.reactedBy.connectedAddresses[0].address
								: null;
						return connectedWalletAddress;
					})
					.filter((address) => address !== null) // Filter out null addresses
			)
		);
	} else if (type === 'replies') {
		addresses = Array.from(
			new Set(
				array
					.map((reply) => {
						const connectedWalletAddress =
							reply?.castedBy?.connectedAddresses &&
							reply.castedBy.connectedAddresses.length > 0 &&
							reply.castedBy.connectedAddresses[0].blockchain === 'ethereum'
								? reply.castedBy.connectedAddresses[0].address
								: null;
						return connectedWalletAddress;
					})
					.filter((address) => address !== null) // Filter out null addresses
			)
		);
	}

	const arrayLength = addresses.length;
	navigator.clipboard.writeText(addresses.join('\n'));
	toast.success(`Found ${arrayLength} verified ethereum addresses. Copied to clipboard. `, toastStyles.success);
};

export default copyAllAddresses;
