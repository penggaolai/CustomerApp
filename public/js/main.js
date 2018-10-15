$(document).ready(function(){
	$('.deleteUser').on('click', deleteUser);
});

function deleteUser(){
	var comfirmation=confirm('Are you sure?');
	if (comfirmation) {
		$.ajax({
			type:'DELETE',
			url:'/users/delete/'+$(this).data('id')
		}).done(function(response){
			//window.location.replace('/');			
		});
	}else{
		return false;
	}
}