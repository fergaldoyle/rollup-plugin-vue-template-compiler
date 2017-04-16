import { createFilter } from 'rollup-pluginutils';
import compiler from 'vue-template-compiler';
import transpileVueTemplate from 'vue-template-es2015-compiler';

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
				const compiled = compiler.compile(code);
				return {
					code: transpileVueTemplate(`module.exports={render:${toFunction(compiled.render)},staticRenderFns:[${compiled.staticRenderFns.map(toFunction).join(',')}]}`).replace('module.exports={', 'export default {'),
					map: { mappings: '' }
				};
			}
		}
	};
}
