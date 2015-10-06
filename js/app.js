/* STUDENTS IGNORE THIS FUNCTION
 * All this does is create an initial
 * attendance record if one is not found
 * within localStorage.
 */
(function() {
    if (!localStorage.attendance) {
        console.log('Creating attendance records...');
        function getRandom() {
            return (Math.random() >= 0.5);
        }

        var nameColumns = $('tbody .name-col'),
            attendance = {};

        nameColumns.each(function() {
            var name = this.innerText;
            attendance[name] = [];

            for (var i = 0; i <= 11; i++) {
                attendance[name].push(getRandom());
            }
        });

        localStorage.attendance = JSON.stringify(attendance);
    }
}());

/* MODEL */
var model = {
    Init : function() {
        model.attendance = JSON.parse(localStorage.attendance);
        model.missed = [];
    }
};

/* VIEW */
var view = {
    Init : function() {
        view.$allMissed = $('tbody .missed-col');
        view.$allCheckboxes = $('tbody input');
        view.AddCheckboxListener();
    },
    UpdateMissing : function() {
        var missing = octopus.GetMissing();
        var count = 0;
        view.$allMissed.each(function () {
            $(this).text(missing[count]);
            count = count + 1;
        });
    },
    UpdateCheckbox : function() {
        var checkbox = octopus.GetCheckbox();
        var count = 0;
        view.$allCheckboxes.each(function() {
            $(this).prop('checked', checkbox[count]);
            count = count + 1;
        })
    },
    AddCheckboxListener : function() {
        view.$allCheckboxes.on('click', function() {octopus.UpdateAttendance(event);});
    }
}

/* OCTOPUS */
var octopus = {
    Init : function() {
        model.Init();
        view.Init();
        octopus.ShowCheckbox();
        octopus.ShowMissing();
    },
    GetMissing : function () {
        var count = 0
        $.each(model.attendance, function(key, value) {
            var missCount = 0;
            for (var i = 0; i < value.length; i = i + 1) {
                if (value[i] === false) {
                    missCount = missCount + 1;
                }
            }
            model.missed[count] = missCount;
            count = count + 1;
        });
        return model.missed;
    },
    GetCheckbox : function () {
        var checkbox = [];
        var count = 0;
        $.each(model.attendance, function(key, value) {
            for (var i = 0; i < value.length; i = i + 1) {
                checkbox[count+i] = value[i];
            }
            count = count + value.length;
        });
        return checkbox;
    },
    ShowMissing : function() {
        view.UpdateMissing();
    },
    ShowCheckbox : function() {
        view.UpdateCheckbox();
    },
    UpdateAttendance : function(event) {
        var checkboxName = $(event.target).parent().parent().children('.name-col').text();
        var checkboxCol = $(event.target).parent().index() - 1;
        model.attendance[checkboxName][checkboxCol] = $(event.target).prop('checked');
        localStorage.attendance = JSON.stringify(model.attendance);

        octopus.ShowCheckbox();
        octopus.ShowMissing();
    }
};

octopus.Init();