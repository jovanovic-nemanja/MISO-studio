import Swal from 'sweetalert2'

export default ({ app }, inject) => {
	inject(
		'swal',
		Swal.mixin({
			buttonsStyling: false,
			confirmButtonClass: 'btn btn-primary mx-2',
			cancelButtonClass: 'btn btn-danger mx-2',
			showLoaderOnConfirm: true,
			inputClass: 'form-control',
			showCancelButton: true,
		})
	)
}
