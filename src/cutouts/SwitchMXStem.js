import Decimal from 'decimal.js'
import makerjs from 'makerjs'
import { CutoutGenerator } from './CutoutGenerator'

// MX stem style cutout
// Cross shape centered at origin

export class SwitchMXStem extends CutoutGenerator {

    generate(key, generatorOptions) {

        // Approximate MX stem dimensions:
        // total cross span ~4.1mm, arm thickness ~1.3mm
        const outerHalf = new Decimal("2.05")
        const innerHalf = new Decimal("0.65")

        // Positive kerf should shrink cutouts.
        const adjustedOuter = Decimal.max(new Decimal("0.2"), outerHalf.minus(generatorOptions.kerf))
        const adjustedInner = Decimal.max(new Decimal("0.1"), innerHalf.minus(generatorOptions.kerf))

        const o = adjustedOuter.toNumber()
        const i = adjustedInner.toNumber()

        // Add a 5.6mm diameter center circle.
        const circleRadius = Decimal.max(new Decimal("0.1"), new Decimal("2.8").minus(generatorOptions.kerf)).toNumber()

        const points = [
            [-i, o],
            [i, o],
            [i, i],
            [o, i],
            [o, -i],
            [i, -i],
            [i, -o],
            [-i, -o],
            [-i, -i],
            [-o, -i],
            [-o, i],
            [-i, i],
        ]

        const paths = {}
        for (let index = 0; index < points.length; index += 1) {
            const nextIndex = (index + 1) % points.length
            paths["line" + index.toString()] = new makerjs.paths.Line(points[index], points[nextIndex])
        }
        paths.centerCircle = new makerjs.paths.Circle([0, 0], circleRadius)

        let model = { paths }

        if (!key.skipOrientationFix && key.height > key.width) {
            model = makerjs.model.rotate(model, -90)
        }

        return model
    }
}
