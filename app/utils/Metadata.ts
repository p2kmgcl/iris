import { PhotoModel } from '../../types/Schema';

const DATE_ATTRIBUTE_NAMES = [
  'xmp:MetadataDate',
  'xmp:ModifyDate',
  'xmp:CreateDate',
  'exif:DateTimeOriginal',
  'tiff:DateTime',
  'video:ModificationDate',
  'video:DateTimeOriginal',
  'photoshop:DateCreated',
];

const LOCATION_ATTRIBUTE_NAMES = [
  {
    getLocation: (element: Element) => {
      function getDegrees(valueString: string, refString: string) {
        const composedRegExp = /(\d+),(\d+\.\d+)[NSWE]/i;
        const lowerRefString = refString.toLowerCase().charAt(0);
        const reverse =
          lowerRefString === 's' || lowerRefString === 'w' ? -1 : 1;

        if (composedRegExp.test(valueString)) {
          const [, degrees, minutes] = composedRegExp.exec(
            valueString,
          ) as string[];

          return reverse * (parseInt(degrees, 10) + parseFloat(minutes) / 60);
        } else if (!isNaN(parseFloat(valueString))) {
          return reverse * parseFloat(valueString);
        }

        return undefined;
      }

      const latitude = getDegrees(
        element.getAttribute('exif:GPSLatitude') as string,
        element.getAttribute('exif:GPSLatitudeRef') as string,
      );

      const longitude = getDegrees(
        element.getAttribute('exif:GPSLongitude') as string,
        element.getAttribute('exif:GPSLongitudeRef') as string,
      );

      const altitude = (function () {
        const altitudeRegExp = /(\d+)\/(\d+)/;
        const altitudeString = element.getAttribute('exif:GPSAltitude');

        if (!altitudeString || !altitudeRegExp.test(altitudeString)) {
          return 0;
        }

        const [, numerator, denominator] = altitudeRegExp.exec(
          altitudeString,
        ) as string[];

        const altitudeRef = parseInt(
          element.getAttribute('exif:GPSAltitudeRef') as string,
          10,
        );

        const reverseAltitude = altitudeRef === 1 ? -1 : 1;

        return (
          reverseAltitude *
          (parseInt(numerator, 10) / parseInt(denominator, 10))
        );
      })();

      if (
        altitude !== undefined &&
        latitude !== undefined &&
        longitude !== undefined
      ) {
        return {
          altitude,
          latitude,
          longitude,
        };
      }

      return undefined;
    },
    attributes: [
      'exif:GPSAltitude',
      'exif:GPSLatitude',
      'exif:GPSLongitude',
      'exif:GPSAltitudeRef',
      'exif:GPSLatitudeRef',
      'exif:GPSLongitudeRef',
    ],
  },
];

export const Metadata = {
  getDateFromString(str: string): number {
    const metadata = new DOMParser().parseFromString(str, 'text/xml');

    const rdfDescription = Array.from(
      metadata.getElementsByTagName('rdf:Description'),
    ).find((element) =>
      DATE_ATTRIBUTE_NAMES.some((attributeName) =>
        element.hasAttribute(attributeName),
      ),
    );

    if (!rdfDescription) {
      return Infinity;
    }

    const dateString = DATE_ATTRIBUTE_NAMES.find(
      (attributeName) =>
        rdfDescription.hasAttribute(attributeName) &&
        rdfDescription.getAttribute(attributeName),
    );

    if (!dateString) {
      return Infinity;
    }

    return new Date(dateString).getTime();
  },

  getLocationFromString(str: string): PhotoModel['location'] {
    const metadata = new DOMParser().parseFromString(str, 'text/xml');

    for (const element of Array.from(
      metadata.getElementsByTagName('rdf:Description'),
    )) {
      for (const { getLocation, attributes } of LOCATION_ATTRIBUTE_NAMES) {
        if (
          attributes.every((attributeName) =>
            element.hasAttribute(attributeName),
          )
        ) {
          return getLocation(element);
        }
      }
    }

    return undefined;
  },
};
