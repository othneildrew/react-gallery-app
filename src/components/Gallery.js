import React from 'react';
import PropTypes from 'prop-types';
import GalleryItem from './GalleryItem';
import NotFound from './NotFound';

const Gallery = ({ data, isLoading }) => {
  let photos;
  
  if (Array.isArray(data) && data.length > 0) {
    photos = data.map((photo, index) => (
      <GalleryItem
        key={index}
        url={`https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`}
        title={photo.title}
      />
    ));
  } else if (!isLoading) {
    // Assign Not Found list item if no photos are provided and application loading state is false
    photos = <NotFound />;
  }

  return (
    <div className="photo-container">
      <h2>Results</h2>
      <ul>
        {photos}
      </ul>
    </div>
  );
}

Gallery.propTypes = {
  data: PropTypes.array,
  isloading: PropTypes.bool
};

export default Gallery;
