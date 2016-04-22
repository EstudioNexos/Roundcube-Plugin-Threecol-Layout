/**
 * ThreeCol plugin script
 */

function init_threecol_splitter() {
	var previewframe = $('#mailpreviewframe').is(':visible');
	$('#mailpreviewtoggle').unbind('click');
	$('#mailpreviewtoggle').click(function(e){ toggle_preview_pane_tc(e); return false });

	mailviewsplit = new rcube_splitter({ id:'mailviewsplittertc', p1:'#mailview-tc-mid', p2:'#mailview-tc-right',
		orientation:'v', relative:true, start:700, min:650, size:12 });

	if (previewframe)
		mailviewsplit.init();
}

function toggle_preview_pane_tc(e)
{
	var mailviewsplit = rcube_splitter.get_instance('mailviewsplittertc');
	var button = $(e.target),
		frame = $('#mailpreviewframe'),
		visible = !frame.is(':visible'),
		splitter = mailviewsplit.pos || parseInt(bw.get_cookie('mailviewsplittertc') || 320),
		topstyles, bottomstyles, uid;

	frame.toggle();
	button.removeClass().addClass(visible ? 'enabled' : 'closed');

	if (visible) {
		$('#mailview-tc-mid').css({ width:'700px', right: 'auto' });
		$('#mailview-tc-right').css({ display: 'block' });

		rcmail.env.contentframe = 'messagecontframe';
		if (uid = rcmail.message_list.get_single_selection())
			rcmail.show_message(uid, false, true);

		// let the splitter set the correct size and position
		if (mailviewsplit.handle) {
			mailviewsplit.handle.show();
			mailviewsplit.resize();
		}
		else
			mailviewsplit.init();
	}
	else {
		rcmail.env.contentframe = null;
		rcmail.show_contentframe(false);

		$('#mailview-tc-mid').css({ width:'100%', right: '0' });
		$('#mailview-tc-right').css({ display: 'none' });

		if (mailviewsplit.handle)
			mailviewsplit.handle.hide();
	}

	if (visible && uid && rcmail.message_list)
		rcmail.message_list.scrollto(uid);

	rcmail.command('save-pref', { name:'preview_pane', value:(visible?1:0) });
}