(function expand_results(cb_obj, others, fig_equity, fig_drawdown, fig_buy_and_hold) {
    const active = cb_obj.active;
    const others_list = (typeof others !== 'undefined') ? others : [];
    const equity = fig_equity;
    const drawdown = fig_drawdown;
    const buy_and_hold = fig_buy_and_hold;

    const equity_height = Math.floor(window.innerHeight * 0.35);
    const drawdown_height =  Math.floor(window.innerHeight * 0.25) - 30;
    const buy_and_hold_height =  Math.floor(window.innerHeight * 0.35);

    // Save original states the first time
    if (!cb_obj._saved_state) {
        cb_obj._saved_state = {
            heights: others_list.map(f => (f ? f.height : null)),
            sizing_modes: others_list.map(f => (f ? f.sizing_mode : null)),
            visible: others_list.map(f => (f ? f.visible : true)),

            equity_height: (equity ? equity.height : null),
            equity_sizing: (equity ? equity.sizing_mode : null),
            equity_visible: (equity ? equity.visible : true),

            drawdown_height: (drawdown ? drawdown.height : null),
            drawdown_sizing: (drawdown ? drawdown.sizing_mode : null),
            drawdown_visible: (drawdown ? drawdown.visible : true),

            buy_and_hold_height: (buy_and_hold ? buy_and_hold.height : null),
            buy_and_hold_sizing: (buy_and_hold ? buy_and_hold.sizing_mode : null),
            buy_and_hold_visible: (buy_and_hold ? buy_and_hold.visible : true),
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

            if (f.id !== equity.id && f.id !== drawdown.id && f.id !== buy_and_hold.id) {
                try {
                    f.visible = false;
                    f.height = 1;
                    f.sizing_mode = null;
                } catch (e) {
                    console.log('hide figure error:', e && e.message);
                }
            }
        }

        // Expand Equity
        try {
            equity.sizing_mode = 'stretch_width';
            equity.height = equity_height;
            equity.visible = true;
        } catch (e) {
            console.log('expand ohlc error:', e && e.message);
        }

        // Expand Drawdown
        try {
            drawdown.sizing_mode = 'stretch_width';
            drawdown.height = drawdown_height;
            drawdown.visible = true;
        } catch (e) {
            console.log('expand pnl error:', e && e.message);
        }

        // Expand Buy & Hold
        try {
            buy_and_hold.sizing_mode = 'stretch_width';
            buy_and_hold.height = buy_and_hold_height;
            buy_and_hold.visible = true;
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
            // Restore Equity
            equity.sizing_mode = saved.equity_sizing;
            if (saved.equity_sizing != null) equity.height = saved.equity_height;
            if (saved.equity_visible != null) equity.visible = saved.equity_visible;

        } catch (e) {
            console.log('restore equity error:', e && e.message);
        }

        try {
            // Restore Drawdown
            drawdown.sizing_mode = saved.drawdown_sizing;
            if (saved.drawdown_height != null) drawdown.height = saved.drawdown_height;
            if (saved.equity_visible != null) equity.visible = saved.equity_visible;

        } catch (e) {
            console.log('restore drawdown error:', e && e.message);
        }

        try {
            // Restore Buy & Hold
            buy_and_hold.sizing_mode = saved.buy_and_hold_sizing;
            if (saved.buy_and_hold_height != null) buy_and_hold.height = saved.buy_and_hold_height;
            if (saved.buy_and_hold_visible != null) buy_and_hold.visible = saved.buy_and_hold_visible;

        } catch (e) {
            console.log('restore Buy & Hold error:', e && e.message);
        }

        force_resize();
    }
})(cb_obj, others, fig_equity, fig_drawdown, fig_buy_and_hold)
