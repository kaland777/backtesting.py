const active = cb_obj.active;
const others_list = (typeof others !== 'undefined') ? others : [];
const ohlc = fig_ohlc;

// Guardar estados originales la primera vez
if (!cb_obj._saved_state) {
    cb_obj._saved_state = {
        heights: others_list.map(f => (f ? f.height : null)),
        sizing_modes: others_list.map(f => (f ? f.sizing_mode : null)),
        ohlc_height: (ohlc ? ohlc.height : null),
        ohlc_sizing: (ohlc ? ohlc.sizing_mode : null),
        // NUEVO: Guardar el estado original del eje X de OHLC
        ohlc_xaxis_visible: (ohlc && ohlc.xaxis && ohlc.xaxis.length > 0) ? ohlc.xaxis[0].visible : null
    };
}

function force_resize() {
    try {
        window.dispatchEvent(new Event('resize'));
    } catch (e) {
        console.log('resize event failed:', e && e.message);
    }
}

if (active) {
    // Ocultar/colapsar las otras figuras
    for (let i = 0; i < others_list.length; i++) {
        const f = others_list[i];
        if (!f) continue;
        if (f.id !== ohlc.id) {
            try {
                f.visible = false;
                f.height = 1;
                f.sizing_mode = null;
            } catch (e) {
                console.log('hide figure error:', e && e.message);
            }
        }
    }

    // Expandir OHLC
    try {
        // (Corrección anterior)
        ohlc.sizing_mode = 'stretch_width';
        ohlc.height = Math.max(window.innerHeight - 80, 200);

        // NUEVO: Mostrar el eje X en el gráfico OHLC
        if (ohlc.xaxis && ohlc.xaxis.length > 0) {
            ohlc.xaxis[0].visible = true;
        }

    } catch (e) {
        console.log('expand ohlc error:', e && e.message);
    }

    force_resize();
} else {
    // Restaurar visibilidad y tamaños originales
    const saved = cb_obj._saved_state;
    for (let i = 0; i < others_list.length; i++) {
        const f = others_list[i];
        if (!f) continue;
        try {
            f.visible = true;
            const h = saved.heights[i];
            const s = saved.sizing_modes[i];
            if (h != null) f.height = h;
            f.sizing_mode = s;
        } catch (e) {
            console.log('restore figure error:', e && e.message);
        }
    }

    try {
        // Restaurar OHLC
        ohlc.sizing_mode = saved.ohlc_sizing;
        if (saved.ohlc_height != null) ohlc.height = saved.ohlc_height;

        // NUEVO: Restaurar la visibilidad original del eje X (ocultarlo)
        if (ohlc.xaxis && ohlc.xaxis.length > 0) {
            ohlc.xaxis[0].visible = saved.ohlc_xaxis_visible;
        }

    } catch (e) {
        console.log('restore ohlc error:', e && e.message);
    }

    force_resize();
}