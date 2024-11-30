import sanitizeHtml from 'sanitize-html';

export interface RenderHtmlBlockProps {
    htmlString: string;
}

const RenderHtmlBlock = (props: RenderHtmlBlockProps) => {
    const { htmlString } = props;
    const sanitizedHtml = sanitizeHtml(htmlString);

    /** variant with custom config
    const sanitizedHtml = sanitize(htmlString, {{
     allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a'],
     allowedAttributes: {
        'a': ['href']
     }});
    */

    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default RenderHtmlBlock;
