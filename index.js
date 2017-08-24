function codeBlocks(md, {referenceClass = 'reference', sampleClass = 'sample'}={}) {
  md.core.ruler.after('block', 'code_sections', addSections);
}

function addSections(state, startLine, endLine) {
  const Token = state.Token;
  let tokens = [];   
  let sections = [] 

  function openSection(attrs, sectionType = 'reference', closeIndex) {
    let t = new Token(`${sectionType}_section_open`, 'section', 1);
    let isReference = sectionType === 'reference';
    let section = {
      type: sectionType,
      closeIndex:closeIndex
    }

    t.block = true;
    t.attrs = attrs || []
    t.attrs.push(['class', isReference ? referenceClass : sampleClass, { append:true }]);

    sections.push(section)

    return t;
  }

  function closeSection(sectionType = 'reference') {
    let t = new Token(`${sectionType}_section_close`, 'section', -1);
    t.block = true;
    sections = sections.filter((section)=>section.type !== sectionType)

    return t;
  }

  function closeAllSections() {
    sections.forEach((section) => {
      tokens.push(closeSection(section.type))
    })
  }

  for (let i = 0; i < state.tokens.length; i++) {
    let token = state.tokens[i];

    if (token.type == 'heading_close') {
      let closeIndex;

      // Find fence occurance, and track its closing tag
      for (let j = i; j < state.tokens.length; j++) {
        let innerToken = state.tokens[j];

        if (innerToken.type.includes('heading_open')) break;

        if (innerToken.type.includes('fence')) {
          closeIndex = j + 1;
        } else if (closeIndex) {
          break;
        }
      }

      tokens.push(token);
      tokens.push(openSection(token.attrs, closeIndex ? 'sample' : 'reference', closeIndex))
    } else {
      let sample = sections.find((section)=>section.type === 'sample')
     
      if (sample && sample.closeIndex == i) {
        tokens.push(closeSection('sample'))
        tokens.push(openSection(token.attrs))
      }

      // Close sections before the next heading
      if (token.type === 'heading_open') {
        closeAllSections()
      }

      tokens.push(token);
    }

    // If we are at the end of the file, ensure all sections are closed
    if (i === state.tokens.length - 1) {
      closeAllSections()
    }
  }

  state.tokens = tokens;
}


module.exports = codeBlocks