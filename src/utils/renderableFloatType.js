import { FloatType, HalfFloatType } from 'three';

// The type a render target that accumulates light can be drawn into on this renderer: 32-bit floats where the
// driver can draw into them (EXT_color_buffer_float), else 16-bit floats, which every WebGL 2 driver that can draw
// into floating-point images at all supports (EXT_color_buffer_half_float), so the path tracer still runs there.
export function renderableFloatType( renderer ) {

	return renderer.extensions.has( 'EXT_color_buffer_float' ) ? FloatType : HalfFloatType;

}

// Whether the renderer can draw into floating-point images of either size, which the path tracer cannot do without.
export function canRenderFloat( renderer ) {

	return renderer.extensions.has( 'EXT_color_buffer_float' ) || renderer.extensions.has( 'EXT_color_buffer_half_float' );

}
