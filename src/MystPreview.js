import React from 'react';
import { visit } from 'unist-util-visit';


import { mystParse  } from 'myst-parser';
import { VFile } from 'vfile';

import {
    mathPlugin,
    footnotesPlugin,
    keysPlugin,
    basicTransformationsPlugin,
    enumerateTargetsPlugin,
    resolveReferencesPlugin,
    WikiTransformer,
    GithubTransformer,
    DOITransformer,
    RRIDTransformer,
    linksPlugin,
    ReferenceState,
    getFrontmatter,
    glossaryPlugin,
    abbreviationPlugin,
    joinGatesPlugin
  } from 'myst-transforms';

import { validatePageFrontmatter } from 'myst-frontmatter';


import { unified } from 'unified';

import { ThemeProvider, Theme, NodeRenderer  } from '@myst-theme/providers';
import { MyST, DEFAULT_RENDERERS } from 'myst-to-react';
import {cardDirective, gridDirective } from 'myst-ext-card';
import { FrontmatterBlock } from '@myst-theme/frontmatter';
import './MystPreview.css';


// Create a new component called MystPreview that takes a value prop and keeps it in state.
function MystPreview(props) {
  const [value, setValue] = React.useState(props.value);
  const [value2, setValue2] = React.useState();
  const [frontmatter, setFrontmatter] = React.useState();

  
  const MYST_THEME = Theme.light;   
  const linkTransforms = [
    new WikiTransformer(),
    new GithubTransformer(),
    new DOITransformer(),
    new RRIDTransformer(),
  ];

  // This function is called whenever the value prop changes.
  React.useEffect(() => {

    const file = new VFile();
    const mdast = mystParse(props.value, {
        markdownit: { linkify: true },
        directives: [cardDirective],
        // roles: [reactiveRole],
        vfile: file,
    });

    const references = {
        cite: { order: [], data: {} },
    };
    const { frontmatter: frontmatterRaw } = getFrontmatter(file, mdast, {
        removeYaml: true,
        removeHeading: false,
    });
    const frontmatter = validatePageFrontmatter(frontmatterRaw, {
        property: 'frontmatter',
        messages: {},
    });

    const state = new ReferenceState({
        numbering: frontmatter.numbering ?? FrontmatterBlock?.numbering,
        file,
    });

    unified()
        .use(basicTransformationsPlugin)
        .use(mathPlugin, { macros: frontmatter?.math ?? {} }) // This must happen before enumeration, as it can add labels
        .use(glossaryPlugin, { state }) // This should be before the enumerate plugins
        .use(abbreviationPlugin, { abbreviations: frontmatter.abbreviations })
        .use(enumerateTargetsPlugin, { state })
        .use(linksPlugin, { transformers: linkTransforms })
        .use(footnotesPlugin)
        .use(joinGatesPlugin)
        .use(resolveReferencesPlugin, { state })
        .use(keysPlugin)
        .runSync(mdast, file);

    visit(mdast, (n) => delete n.position);

    //setValue(props.value);
    setValue2(mdast);
    setFrontmatter(frontmatter)

  }, [props.value]);

  // Return a div with dangerouslySetInnerHTML set to the value.
  return (
    <div className="panel">
        <div className="panel-wrapper">
            <div className="panel">
                <ThemeProvider renderers={DEFAULT_RENDERERS} theme={MYST_THEME}>
                    <FrontmatterBlock frontmatter={frontmatter} className='frontmatter'></FrontmatterBlock>
                    <MyST ast={value2} />
                </ThemeProvider>
            </div>
        </div>
    </div>
  );
}

export default MystPreview;