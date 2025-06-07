import { convert, OKHSL, OKHSV, OKLab, sRGB } from '@texel/color';

export interface RGB {
	r: number;
	g: number;
	b: number;
}

export interface OKlab {
	l: number;
	a: number;
	b: number;
}

export interface OKhsv {
	h: number;
	s: number;
	v: number;
}

export interface OKhsl {
	h: number;
	s: number;
	l: number;
}

export function oklab_to_okhsv(oklab: OKlab): OKhsv {
	const [h, s, v] = convert([oklab.l, oklab.a, oklab.b], OKLab, OKHSV);
	return { h: h ?? 0, s, v };
}

export function okhsv_to_rgb(okhsv: OKhsv): RGB {
	const [r, g, b] = convert([okhsv.h, okhsv.s, okhsv.v], OKHSV, sRGB);
	return { r, g, b };
}

export function rgb_to_hex(rgb: RGB): string {
	// convert from 0-1 to 0-255
	const r = Math.round(rgb.r * 255);
	const g = Math.round(rgb.g * 255);
	const b = Math.round(rgb.b * 255);
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function hex_to_rgb(hex: string): RGB {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	// convert from 0-255 to 0-1
	const r_ = r / 255;
	const g_ = g / 255;
	const b_ = b / 255;
	return { r: r_, g: g_, b: b_ };
}

export function okhsv_to_oklab(okhsv: OKhsv): OKlab {
	const [l, a, b] = convert([okhsv.h, okhsv.s, okhsv.v], OKHSV, OKLab);
	return { l, a, b };
}

export function rgb_to_okhsv(rgb: RGB): OKhsv {
	const [h, s, v] = convert([rgb.r, rgb.g, rgb.b], sRGB, OKHSV);
	return { h, s, v };
}

export function okhsl_to_rgb(okhsl: OKhsl): RGB {
	const [r, g, b] = convert([okhsl.h, okhsl.s, okhsl.l], OKHSL, sRGB);
	return { r, g, b };
}
