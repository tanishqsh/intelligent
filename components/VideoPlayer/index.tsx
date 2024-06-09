import React, { useEffect, useRef, FunctionComponent } from 'react';
import Hls from 'hls.js';

interface VideoPlayerProps {
	src: string;
}

const VideoPlayer: FunctionComponent<VideoPlayerProps> = ({ src }) => {
	const videoRef = useRef<HTMLVideoElement>(null);

	useEffect(() => {
		let hls: Hls | undefined;

		if (videoRef.current) {
			if (Hls.isSupported()) {
				hls = new Hls();
				hls.loadSource(src);
				hls.attachMedia(videoRef.current);
				hls.on(Hls.Events.MANIFEST_PARSED, function () {
					// Removed autoplay
				});
			} else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
				videoRef.current.src = src;
				videoRef.current.addEventListener('loadedmetadata', function () {
					// Removed autoplay
				});
			}
		}

		return () => {
			if (hls) {
				hls.destroy();
			}
		};
	}, [src]);

	return <video className="rounded-md" ref={videoRef} controls style={{ width: '100%' }} />;
};

export default VideoPlayer;
