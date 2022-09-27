import {useEffect} from 'react'

function useAsyncEffect(effect: () => Promise<unknown>, inputs: unknown[]): void {
	useEffect(() => {
		effect().catch(console.error)
	}, inputs)
}

export default useAsyncEffect
