var settings_notifications = (function () {

var exports = {};

var stream_notification_settings = [
    "enable_stream_desktop_notifications",
    "enable_stream_push_notifications",
    "enable_stream_audible_notifications",
    "enable_stream_email_notifications",
];

var pm_mention_notification_settings = [
    "enable_desktop_notifications",
    "enable_offline_email_notifications",
    "enable_offline_push_notifications",
    "enable_sounds",
];

var other_notification_settings = [
    "pm_content_in_desktop_notifications",
    "enable_online_push_notifications",
    "notification_sound",
    "enable_digest_emails",
    "enable_login_emails",
    "realm_name_in_notifications",
    "message_content_in_email_notifications",
];

var notification_settings_status = [
    {status_label: "pm-mention-notify-settings-status", settings: pm_mention_notification_settings},
    {status_label: "other-notify-settings-status", settings: other_notification_settings},
    {status_label: "stream-notify-settings-status", settings: stream_notification_settings},
];

exports.all_notification_settings_labels = other_notification_settings.concat(
    pm_mention_notification_settings,
    stream_notification_settings
);

function change_notification_setting(setting, setting_data, status_element) {
    var data = {};
    data[setting] = JSON.stringify(setting_data);
    settings_ui.do_settings_change(channel.patch, '/json/settings/notifications', data, status_element);
}

exports.set_enable_digest_emails_visibility = function () {
    if (page_params.realm_digest_emails_enabled) {
        $('#enable_digest_emails_label').parent().show();
    } else {
        $('#enable_digest_emails_label').parent().hide();
    }
};

exports.set_up = function () {
    _.each(notification_settings_status, function (setting) {
        _.each(setting.settings, function (sub_setting) {
            $("#" + sub_setting).change(function () {
                var value;

                if (sub_setting === "notification_sound") {
                    // `notification_sound` is not a boolean.
                    value = $(this).val();
                } else {
                    value = $(this).prop('checked');
                }
                change_notification_setting(sub_setting, value,
                                            "#" + setting.status_label);
            });
        });
    });

    $("#play_notification_sound").click(function () {
        $("#notifications-area").find("audio")[0].play();
    });

    var notification_sound_dropdown = $("#notification_sound");
    notification_sound_dropdown.val(page_params.notification_sound);

    $("#enable_sounds, #enable_stream_audible_notifications").change(function () {
        if ($("#enable_stream_audible_notifications").prop("checked") || $("#enable_sounds").prop("checked")) {
            notification_sound_dropdown.prop("disabled", false);
            notification_sound_dropdown.parent().removeClass("control-label-disabled");
        } else {
            notification_sound_dropdown.prop("disabled", true);
            notification_sound_dropdown.parent().addClass("control-label-disabled");
        }
    });
    exports.set_enable_digest_emails_visibility();
};

exports.update_page = function () {
    _.each(exports.all_notification_settings_labels, function (setting) {
        if (setting === 'enable_offline_push_notifications'
            && !page_params.realm_push_notifications_enabled) {
            // If push notifications are disabled at the realm level,
            // we should just leave the checkbox always off.
            return;
        }
        $("#" + setting).prop('checked', page_params[setting]);
    });
};

return exports;
}());

if (typeof module !== 'undefined') {
    module.exports = settings_notifications;
}
window.settings_notifications = settings_notifications;
