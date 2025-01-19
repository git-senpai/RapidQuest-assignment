const generateEmailTemplate = ({
  title,
  sections,
  styles,
  imageUrl,
  imageStyles,
  API_URL,
}) => {
  // Helper function to clean and preserve inline styles
  const preserveInlineStyles = (content) => {
    if (!content) return "";
    return (
      content
        // Text alignment - wrap in div to ensure alignment works
        .replace(
          /class="ql-align-center"/g,
          'style="text-align: center !important;"'
        )
        .replace(
          /class="ql-align-right"/g,
          'style="text-align: right !important;"'
        )
        .replace(
          /class="ql-align-justify"/g,
          'style="text-align: justify !important;"'
        )
        .replace(
          /class="ql-align-left"/g,
          'style="text-align: left !important;"'
        )
        // Font sizes
        .replace(
          /class="ql-size-small"/g,
          'style="font-size: 0.75em !important"'
        )
        .replace(
          /class="ql-size-large"/g,
          'style="font-size: 1.5em !important"'
        )
        .replace(/class="ql-size-huge"/g, 'style="font-size: 2.5em !important"')
        // Keep existing styles and make them !important
        .replace(/style="([^"]*)"/g, (match, existingStyles) => {
          const styles = existingStyles.split(";").filter((s) => s.trim());
          const importantStyles = styles.map((style) => {
            const [prop, val] = style.split(":").map((s) => s.trim());
            // Don't add !important if it's already there
            return `${prop}: ${val}${
              val.includes("!important") ? "" : " !important"
            }`;
          });
          return `style="${importantStyles.join("; ")}"`;
        })
    );
  };

  // Helper function to wrap content with alignment div if needed
  const wrapWithAlignment = (content, sectionStyles) => {
    if (!content) return "";
    const alignment = sectionStyles.textAlign || "left";
    return `<div style="text-align: ${alignment} !important; width: 100% !important; display: block !important; word-wrap: break-word !important; overflow-wrap: break-word !important;">${content}</div>`;
  };

  // Helper function to get image styles based on alignment
  const getImageStyles = () => {
    const baseStyles = `
      width: ${imageStyles.width} !important;
      max-height: ${imageStyles.maxHeight} !important;
      object-fit: contain !important;
    `;

    switch (imageStyles.alignment) {
      case "center":
        return `${baseStyles}
          display: block !important;
          margin: 0 auto !important;
          float: none !important;`;
      case "left":
        return `${baseStyles}
          display: inline-block !important;
          float: left !important;
          margin-right: 20px !important;
          margin-bottom: 10px !important;`;
      case "right":
        return `${baseStyles}
          display: inline-block !important;
          float: right !important;
          margin-left: 20px !important;
          margin-bottom: 10px !important;`;
      default:
        return baseStyles;
    }
  };

  return `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
      }
      .container {
        max-width: 800px;
        margin: 40px auto;
        background: #ffffff;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .preview-container {
        background: #ffffff;
        border-radius: 4px;
      }
      .header {
        ${Object.entries(styles.header)
          .map(([key, value]) => `${key}: ${value} !important;`)
          .join("\n        ")}
        margin-bottom: 1rem !important;
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 15px !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        min-height: 50px !important;
      }
      .content {
        ${Object.entries(styles.content)
          .map(([key, value]) => `${key}: ${value} !important;`)
          .join("\n        ")}
        margin-bottom: 1rem !important;
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 15px !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      .footer {
        ${Object.entries(styles.footer)
          .map(([key, value]) => `${key}: ${value} !important;`)
          .join("\n        ")}
        border-top: 1px solid #e5e7eb !important;
        padding-top: 1rem !important;
        margin-top: 2rem !important;
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 15px !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      .image-container {
        text-align: ${imageStyles.alignment} !important;
        margin: 1rem 0 !important;
        display: block !important;
        width: 100% !important;
        overflow: hidden !important;
        box-sizing: border-box !important;
      }
      .image-container::after {
        content: "" !important;
        display: table !important;
        clear: both !important;
      }
      .image-container img {
        ${getImageStyles()}
      }
      
      /* Quill specific styles */
      .ql-align-center { text-align: center !important; }
      .ql-align-right { text-align: right !important; }
      .ql-align-left { text-align: left !important; }
      .ql-align-justify { text-align: justify !important; }
      
      /* Font sizes */
      .ql-size-small { font-size: 0.75em !important; }
      .ql-size-large { font-size: 1.5em !important; }
      .ql-size-huge { font-size: 2.5em !important; }
      
      /* Rich text elements */
      p { 
        margin: 0 0 1em 0 !important;
        line-height: inherit !important;
        width: 100% !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      strong, b { font-weight: bold !important; }
      em, i { font-style: italic !important; }
      u { text-decoration: underline !important; }
      s { text-decoration: line-through !important; }
      
      /* Lists */
      ul, ol {
        margin: 1em 0 !important;
        padding-left: 2em !important;
        width: 100% !important;
        box-sizing: border-box !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      li {
        margin-bottom: 0.5em !important;
        list-style-position: outside !important;
      }
      
      /* Headers */
      h1, h2, h3, h4, h5, h6 {
        width: 100% !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
        box-sizing: border-box !important;
      }
      h1 { font-size: 2em !important; margin: 0.67em 0 !important; }
      h2 { font-size: 1.5em !important; margin: 0.75em 0 !important; }
      h3 { font-size: 1.17em !important; margin: 0.83em 0 !important; }
      h4 { font-size: 1em !important; margin: 1.12em 0 !important; }
      h5 { font-size: 0.83em !important; margin: 1.5em 0 !important; }
      h6 { font-size: 0.75em !important; margin: 1.67em 0 !important; }
      
      /* Links */
      a {
        color: inherit !important;
        text-decoration: underline !important;
      }
      
      /* Background colors */
      [style*="background-color"] { background-color: inherit !important; }
      [style*="color:"] { color: inherit !important; }
      
      /* Preserve all inline styles */
      [style] {
        background-color: inherit !important;
        color: inherit !important;
        font-family: inherit !important;
        line-height: inherit !important;
        word-wrap: break-word !important;
        overflow-wrap: break-word !important;
      }
      
      /* Responsive design */
      @media (max-width: 768px) {
        .container {
          margin: 20px !important;
          padding: 20px !important;
        }
      }
    </style>
</head>
<body>
    <div class="container">
      <div class="preview-container">
        <div class="header" style="background-color: ${
          styles.header.backgroundColor || "transparent"
        } !important; color: ${styles.header.color || "inherit"} !important;">
          ${wrapWithAlignment(
            preserveInlineStyles(sections.header),
            styles.header
          )}
        </div>
        ${
          imageUrl
            ? `
        <div class="image-container">
          <img 
            src="${API_URL}${imageUrl}" 
            alt="Email Image"
            style="${getImageStyles()}"
          />
        </div>
        `
            : ""
        }
        <div class="content" style="background-color: ${
          styles.content.backgroundColor || "transparent"
        } !important; color: ${styles.content.color || "inherit"} !important;">
          ${wrapWithAlignment(
            preserveInlineStyles(sections.content),
            styles.content
          )}
        </div>
        <div class="footer" style="background-color: ${
          styles.footer.backgroundColor || "transparent"
        } !important; color: ${styles.footer.color || "inherit"} !important;">
          ${wrapWithAlignment(
            preserveInlineStyles(sections.footer),
            styles.footer
          )}
        </div>
      </div>
    </div>
</body>
</html>`;
};

export default generateEmailTemplate;
