import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'redux/store';

export function getJwtToken() {
	const me:any = useSelector(({ mbr }: RootState) => mbr.jwtToken, shallowEqual);
	return me;
}

export function getMemberSeq() {
	const me:any = useSelector(({ mbr }: RootState) => mbr.memberSeq, shallowEqual);
	return me;
}

export function getBase() {
	const me:any = useSelector(({ mbr }: RootState) => mbr.base, shallowEqual);
	return me;
}
export function getProfileImg() {
	const me:any = useSelector(({ mbr }: RootState) => mbr.profileImg, shallowEqual);
	return me;
}

export function getSecondAuth() {
	const me:any = useSelector(({ mbr }: RootState) => mbr.secondAuth, shallowEqual);
	return me;
}

export function getIdealType() {
	const me:any = useSelector(({ mbr }: RootState) => mbr.idealType, shallowEqual);
	return me;
}

export function getInterview() {
	const me:any = useSelector(({ mbr }: RootState) => mbr.interview, shallowEqual);
	return me;
}