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
};
