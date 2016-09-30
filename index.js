import { createFilter } from 'rollup-pluginutils';
import compiler from 'vue-template-compiler';

function toFunction (code) {
  return `function(){${code}}`
}

export default function string(opts = {}) {
	if (!opts.include) {
		throw Error('include option should be specified');
	}

	const filter = createFilter(opts.include, opts.exclude);

	return {
		name: 'vue-template-compiler',

		transform(code, id) {
			if (filter(id)) {
				return {
					code: `export default {render:${toFunction(compiled.render)},staticRenderFns:[${compiled.staticRenderFns.map(toFunction).join(',')}]}`,
					map: { mappings: '' }
				};
			}
		}
	};
}
