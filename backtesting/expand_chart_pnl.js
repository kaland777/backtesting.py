(function expand_chart_pnl(cb_obj, others, fig_ohlc, fig_pnl) {
    const active = cb_obj.active;
    const others_list = (typeof others !== 'undefined') ? others : [];
    const ohlc = fig_ohlc;
    const pnl = fig_pnl;

    const pnl_height = Math.floor(window.innerHeight * 0.10);
    const ohlc_height = Math.floor(window.innerHeight - pnl_height - 80);

    // Guardar estados originales la primera vez
    if (!cb_obj._saved_state) {
        cb_obj._saved_state = {
            heights: others_list.map(f => (f ? f.height : null)),
            sizing_modes: others_list.map(f => (f ? f.sizing_mode : null)),
            ohlc_height: (ohlc ? ohlc.height : null),
            ohlc_sizing: (ohlc ? ohlc.sizing_mode : null),
            pnl_height: (pnl ? pnl.height : null),
            pnl_sizing: (pnl ? pnl.sizing_mode : null)
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
            if (f.id !== ohlc.id && f.id !== pnl.id ) {
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
            ohlc.sizing_mode = 'stretch_width';
            ohlc.height = ohlc_height;
        } catch (e) {
            console.log('expand ohlc error:', e && e.message);
        }

        // Expandir PNL (darle una altura razonable)
        try {
            pnl.sizing_mode = 'stretch_width';
            pnl.height = pnl_height;
        } catch (e) {
            console.log('expand pnl error:', e && e.message);
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

        } catch (e) {
            console.log('restore ohlc error:', e && e.message);
        }

        try {
            // Restaurar PNL
            pnl.sizing_mode = saved.pnl_sizing;
            if (saved.pnl_height != null) pnl.height = saved.pnl_height;

        } catch (e) {
            console.log('restore pnl error:', e && e.message);
        }

        force_resize();
    }
})(cb_obj, others, fig_ohlc, fig_pnl)
