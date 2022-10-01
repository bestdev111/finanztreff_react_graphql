export function KOTypMapping(name: String | undefined | null) {
    switch (name) {
        case "Open End X Turbo":
            return "OE X Turbo"
        case "KO mit SL (Open End)":
            return "KO m. SL"
        case "KO Classic":
            return "Classic"
        case "KO ohne SL (Open End)":
            return "KO o. SL"
        case "X Turbo":
            return "X Turbo"
        case "Smart KO":
            return "Smart KO"
        default:
            return name
    }
}

export function factorTypeMapping(name: string | undefined | null){
    switch (name){
        case "Faktor-Zertifikate - mit Hebel":
            return "mit Hebel"
        case "Faktor-Zertifikate - Sonstige":
            return "Sonstige"
        case "Faktor-Zertifikate - ohne Hebel":
            return "ohne Hebel"
        default :
            return name
    }
}

export function discountTypMapping(name: String | undefined | null){
    switch (name) {
        case "Discount-Zertifikate - Classic":
            return "Classic"
        case "Discount-Zertifikate - Protect":
            return "Protect"
        case "Discount-Zertifikate - Protect Pro":
            return "Protect Pro"
        case "Discount-Zertifikate - Reverse":
            return "Reverse"
        case "Discount-Zertifikate - Multi":
            return "Multi"
        case "Discount-Zertifikate - Multi Protect":
            return "Multi Protect"
        case "Discount-Zertifikate - Rolling":
            return "Rolling"
        case "Discount-Zertifikate - Korridor":
            return "Korridor"
        case "Discount-Zertifikate - Sonstige":
            return "Sonstige"
        default:
            return name
    }
}

export function certTypMapping(name: String | null | undefined){
    switch (name) {
        case "Faktor-Zertifikate - mit Hebel":
            return "Mit Hebel"
        case "Faktor-Zertifikate - Sonstige":
            return "Sonstige"
        case "Faktor-Zertifikate - ohne Hebel":
            return "Ohne Hebel"
        default:
            return name
    }
}

export function bonusTypMapping(name: String | undefined | null) {
    switch (name) {
        case "Bonus-Zertifikate - Classic":
            return "Classic"
        case "Bonus-Zertifikate - Capped":
            return "Capped"
        case "Bonus-Zertifikate - Pro":
            return "Pro"
        case "Bonus-Zertifikate - Capped Pro":
            return "Capped Pro"
        case "Bonus-Zertifikate - Reverse":
            return "Reverse"
        case "Bonus-Zertifikate - Capped Reverse":
            return "Capped Reverse"
        case "Bonus-Zertifikate - Capped Reverse Pro":
            return "Capped Reverse Pro"
        case "Bonus-Zertifikate - Reverse Pro":
            return "Reverse Pro"
        case "Bonus-Zertifikate - Multi":
            return "Multi"
        case "Bonus-Zertifikate - Capped Multi":
            return "Capped Multi"
        case "Bonus-Zertifikate - Easy":
            return "Easy"
        case "Bonus-Zertifikate - Capped Easy":
            return "Capped Easy"
        case "Bonus-Zertifikate - Korridor":
            return "Korridor"
        case "Bonus-Zertifikate - Korridor Pro":
            return "Korridor Pro"
        case "Bonus-Zertifikate - Multi Pro":
            return "Multi Pro"
        case "Bonus-Zertifikate - Alpha":
            return "Alpha"
        case "Bonus-Zertifikate - Outperformance":
            return "Outperformance"
        case "Bonus-Zertifikate - Capped Outperformance":
            return "Capped Outperformance"
        case "Bonus-Zertifikate - Sonstige":
            return "Sonstige"
        default:
            return name
    }
}

export function expressTypMapping(name: String | undefined | null){
    switch (name){
        case "Express-Zertifikate - Classic":
            return "Classic"
        case "Express-Zertifikate - Easy":
            return "Easy"
        case "Express-Zertifikate - Sonstige":
            return "Sonstige"
        default:
            return name
    }
}

export function revConvertibleTypMapping(name: String | undefined | null) {
    switch (name) {
        case "Aktienanleihen - Classic":
            return "Classic"
        case "Aktienanleihen - Protect":
            return "Protect"
        case "Aktienanleihen - Protect Pro":
            return "Protect Pro"
        case "Aktienanleihen - Sonstige":
            return "Sonstige"
        default:
            return name
    }
}

export function capitalTypMapping(name: String | undefined | null) {
    switch (name) {
        case "Kapitalschutz-Zertifikate - Classic":
            return "Classic"
        case "Kapitalschutz-Zertifikate - Capped":
            return "Capped"
        case "Kapitalschutz-Zertifikate - Alpha":
            return "Alpha"
        case "Kapitalschutz-Zertifikate - Bonus":
            return "Bonus"
        case "Kapitalschutz-Zertifikate - Reverse":
            return "Reverse"
        case "Kapitalschutz-Zertifikate - Sonstige":
            return "Sonstige"
        default:
            return name
    }
}
export function outperfSprintTypMapping(name: String | undefined | null) {
    switch (name) {
        case "Outperformance-Zertifikate - Classic":
            return "Classic"
        case "Outperformance-Zertifikate - Twin Win":
            return "Twin Win"
        case "Outperformance-Zertifikate - Capped Twin Win":
            return "Capped Twin Win"
        case "Outperformance-Zertifikate - Sonstige":
            return "Sonstige"
        case "Sprint-Zertifikate - Classic":
            return "Classic"
        case "Sprint-Zertifikate - Protect":
            return "Protect"
        case "Sprint-Zertifikate - Reverse":
            return "Reverse"
        case "Sprint-Zertifikate - Sonstige":
            return "Sonstige"
        default:
            return name
    }
}
export function indexTypMapping(name: String | undefined | null) {
    switch (name) {
        case "Index-/Partizipations-Zertifikate - Classic":
            return "Classic"
        case "Index-/Partizipations-Zertifikate - Kapitalschutz < 100%":
            return "Kapitalschutz < 100%"
        case "Index-/Partizipations-Zertifikate - Alpha":
            return "Alpha"
        case "Index-/Partizipations-Zertifikate - Reverse":
            return "Reverse"
        case "Index-/Partizipations-Zertifikate - Airbag Classic":
            return "Airbag Classic"
        case "Index-/Partizipations-Zertifikate - Capped Airbag":
            return "Capped Airbag"
        case "Index-/Partizipations-Zertifikate - Hedgefonds":
            return "Hedgefonds"
        case "Index-/Partizipations-Zertifikate - DuoRendite":
            return "DuoRendite"
        case "Index-/Partizipations-Zertifikate - Sonstige":
            return "Sonstige"
        default:
            return name
    }
}
