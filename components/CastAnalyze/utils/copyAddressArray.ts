import toast from 'react-hot-toast';
import toastStyles from '../../../utils/toastStyles';

const getEthereumAddress = (addresses: { address: string; blockchain: string }[]): string | null => {
	const ethereumAddress = addresses.find((address) => address.blockchain === 'ethereum');
	return ethereumAddress ? ethereumAddress.address : null;
};

const extractAddresses = (array: any[], key: string): string[] => {
	return Array.from(
		new Set(
			array
				.map((item) => {
					const addresses = item[key]?.connectedAddresses;
					return addresses ? getEthereumAddress(addresses) : null;
				})
				.filter((address) => address !== null) // Filter out null addresses
		)
	) as string[];
};

const copyAllAddresses = (type: string, array: any[]) => {
	let addresses: string[] = [];
	const keyMap: { [key: string]: string } = {
		likes: 'reactedBy',
		recasts: 'reactedBy',
		replies: 'castedBy',
	};

	if (keyMap[type]) {
		addresses = extractAddresses(array, keyMap[type]);
	}

	const arrayLength = addresses.length;
	navigator.clipboard.writeText(addresses.join('\n'));
	toast.success(`Found ${arrayLength} verified ethereum addresses. Copied to clipboard.`, toastStyles.success);
};

export default copyAllAddresses;
