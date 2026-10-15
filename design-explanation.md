# Touchstone 3 Design Explanation

## Client Alignment

Riverbend Yoga Studio serves beginners, busy professionals, and older adults. The updated design keeps the existing class, instructor, accessibility, and event information easy to scan. Clear navigation, readable type, visible form labels, and comfortable spacing support visitors who may be new to yoga or using the site on a phone.

## Color Palette

- Forest green (`#203d35`) anchors headings, navigation, and the footer. It gives the studio a calm, grounded identity and provides strong contrast for light text.
- Fern (`#638575`) supports links, accents, and form controls, reinforcing the natural yoga setting without making the whole page one shade.
- Coral (`#a64932`) is reserved for small emphasis details such as focus outlines and heading rules, helping important interactions stand out.
- Mist (`#f1f6f2`) is the primary surface color. Its subtle grid texture adds depth while keeping long sections comfortable to read.

## Typography

Georgia is used for display headings to create a welcoming, editorial feel. Trebuchet MS is used for body copy and controls for clear reading at smaller sizes. The two-family system creates hierarchy without making the pages feel inconsistent.

## Responsive Design

The shared stylesheet uses flexible widths, Flexbox navigation, and CSS Grid for the homepage feature and repeated content. At narrower widths, navigation wraps, multi-column content becomes a single column, policy details stack, and tables scroll horizontally instead of forcing the whole page wider. Media, images, and form controls stay within their available width.

## Design Challenge

The site has several kinds of content, including pricing tables, instructor profiles, audio and video, and a multi-part request form. A shared stylesheet gives them a consistent visual language while allowing each content type to remain recognizable and usable. The mobile layout required special care for the wide pricing table and the form's radio choices; the table is independently scrollable and the choices remain naturally wrapped and labeled.