function codeBlocks(md, { referenceClass = 'reference', sampleClass = 'sample', levelGrouping } = {}) {
  console.log(levelGrouping)
  if(!(levelGrouping <= 7 && levelGrouping >= 1) && levelGrouping ) {
    throw new Error("The given value for the levelGrouping argument is invalid. It must be either undefined, or an integer between 1 and 7 inclusive");
  }

  function addSections(state, startLine, endLine) {
    const Token = state.Token;
    const tokens = [];
    let sections = [];

    function openSection(attrs, sectionType = 'reference', closeIndex) {
      let t = new Token(`${sectionType}_section_open`, 'section', 1);
      let isReference = sectionType === 'reference';
      let section = {
        type: sectionType,
        closeIndex: closeIndex,
      };

      t.block = true;
      t.attrs = attrs || [];
      t.attrs.push(['class', isReference ? referenceClass : sampleClass, { append: true }]);

      sections.push(section);

      return t;
    }

    function closeSection(sectionType = 'reference') {
      let filteredSections = sections.filter((section) => section.type !== sectionType);
      let t = new Token(`${sectionType}_section_close`, 'section', -1);

      t.block = true;
      sections = filteredSections;

      return t;
    }

    function closeAllSections() {
      sections.forEach((section) => {
        tokens.push(closeSection(section.type));
      });
    }

    for (let i = 0; i < state.tokens.length; i++) {
      let token = state.tokens[i];
      let currentLevel = headingLevel(token.tag);

      if (token.type == 'heading_close') {
        let closeIndex = null;

        // Find fence occurance, and track its closing tag
        for (let j = i; j < state.tokens.length; j++) {
          let innerToken = state.tokens[j];

          if (innerToken.type.includes('heading_open') && (!levelGrouping || headingLevel(innerToken.tag) <= levelGrouping)) break;

          if (innerToken.type.includes('fence')) {
            closeIndex = j + 1;
          } else if (closeIndex) {
            break;
          }
        }

        // Add current token to list
        tokens.push(token);
        console.log(closeIndex)
        // Add new section token depending on grouping configuration
        if(!levelGrouping  || levelGrouping >= currentLevel){
          tokens.push(openSection(token.attrs, closeIndex ? 'sample' : 'reference', closeIndex));
        }
      } else {
        let sample = sections.find((section) => section.type === 'sample');

        if (sample && sample.closeIndex == i) {
          tokens.push(closeSection('sample'));
          tokens.push(openSection(token.attrs));
        }

        // Close sections before the next heading
        if (token.type === 'heading_open' && (!levelGrouping || currentLevel <= levelGrouping)) {
            closeAllSections();
        }

        tokens.push(token);
      }

      // If we are at the end of the file, ensure all sections are closed
      if (i === state.tokens.length - 1) {
        closeAllSections();
      }
    }

    state.tokens = tokens;
    console.log(tokens)
  }

  md.core.ruler.after('block', 'code_sections', addSections);
}

function headingLevel(header) {
  return parseInt(header.charAt(1));
}

module.exports = codeBlocks;