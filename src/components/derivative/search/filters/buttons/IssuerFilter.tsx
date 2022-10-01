import {Dropdown, Modal, Row, Spinner} from "react-bootstrap";
import React, {useContext, useEffect, useState} from "react";
import {checkboxList} from "../../checkboxList";
import {DropdownMenuHeader} from "../layout/DropdownMenuHeader";
import {DropdownMenuFooter} from "../layout/DropdownMenuFooter";
import {DropdownButton} from "../layout/DropdownButton";
import {useBootstrapBreakpoint} from "../../../../../hooks/useBootstrapBreakpoint";
import {CSSTransition} from "react-transition-group";
import {SvgCheck} from "../../../../common/svg/svg-check";
import {SvgCancel} from "../../../../common/svg/svg-cancel";
import {gql, useQuery} from "@apollo/client";
import {Issuer} from "../../../../../generated/graphql";
import {DerivativeFilter} from "../../types/DerivativeSearchTypes";
import {ConfigContext, DataContext} from "../../../DerivativeSearch";
import {guessInfonlineSection, trigInfonline} from "../../../../common/InfonlineService";

interface IssuerFilterProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFilter: DerivativeFilter;
    showButton?: boolean;
    showContent?: boolean;
    contentActive?: boolean;
    onClick?: () => any;
    onFilterChange?: (filter: DerivativeFilter) => any;
    onVisbilityChange?: (isVisible: boolean) => any;
}

const GET_ISSUERS = gql`
    query getIssuers($underlyingInstrumentGroupId: Int!, $assetTypeGroup: String!) {
        group(id:$underlyingInstrumentGroupId) {
            id
            derivativeIssuer(criteria: {assetTypeGroup: $assetTypeGroup}) {
                issuer {
                    id
                    name
                    partner
                }
                count
            }
        }
    }
`;

export function IssuerFilter({
                                 currentFilter,
                                 showButton,
                                 showContent,
                                 contentActive,
                                 onClick,
                                 onFilterChange,
                                 onVisbilityChange,
                                 className
                             }: IssuerFilterProps) {

    const [show, setShow] = useState(false);
    const [checkedStatus, setCheckedStatus] = useState<any>([])
    const [checkedAll, setCheckedAll] = useState(false)
    const [resetAll, setResetAll] = useState(false)
    const config = useContext(ConfigContext);
    const isDesktop = useBootstrapBreakpoint({
        xl: true,
        default: false
    });

    const {loading, error, data} = useQuery(GET_ISSUERS, {
        variables: {
            underlyingInstrumentGroupId: config.getSearchConfig().underlying?.group.id,
            assetTypeGroup: config.getSearchConfig().assetTypeGroup?.id
        }
    });

    useEffect(() => {
        subText();
    }, [currentFilter]);

    useEffect(() => {
        if (data) {
            const issuers = data.group.derivativeIssuer.map((i: any) => {
                return {
                    id: i.issuer.id, name: i.issuer.name, value: i.issuer.name, count: i.count,
                    checkedStatus: currentFilter.issuers?.findIndex(
                        i1 => {
                            if (i1.id === i.issuer.id) {
                                i1.name = i.issuer.name;
                                return true;
                            } else return false;
                        }) > -1
                }
            }).sort((a: any, b: any) => {
                if (a.count > 0 && b.count === 0) return -1;
                if (a.count === 0 && b.count > 0) return 1;

                if (a.partner === true && b.partner === false) return 1;
                if (b.partner === true && a.partner === false) return -1;
                return a.name?.localeCompare(b.name || '');
            });

            setCheckedStatus(issuers);
        }
    }, [data]);

    useEffect(() => {
        let allChecked = true, noneChecked = true;
        for (let i = 0; i < checkedStatus.length; i++) {
            allChecked = allChecked && checkedStatus[i].checkedStatus;
            noneChecked = noneChecked && !checkedStatus[i].checkedStatus;
        }
        setCheckedAll(allChecked);
        setResetAll(noneChecked);
        subText();
    }, [checkedStatus])


    const close = () => {
        setShow(false);
    };

    const subText = function () {
        if (currentFilter.issuers.length === 0) return ' ';
        if (currentFilter.issuers.length === 1) return currentFilter.issuers[0].name;
        return currentFilter.issuers[0].name + ', ... (+ ' + (currentFilter.issuers.length - 1) + ')';
    }

    const sendFilter = (newFilter: DerivativeFilter) => {
        if (onFilterChange) onFilterChange(newFilter);
        if (onVisbilityChange) onVisbilityChange(false);
    }

    const resetFilter = () => {
        sendFilter({...currentFilter, issuers: []});
        handleResetAll();
        close();
    }

    const applyFilter = () => {
        trigInfonline(guessInfonlineSection(),'search_result')
        const selected = checkedStatus.filter((item: any) => item.checkedStatus);
        sendFilter({...currentFilter, issuers: selected});
        close();
    }

    const cancelFilter = () => {
        if (onVisbilityChange) onVisbilityChange(false);
        close();
    }

    const handleSelectAll = () => {
        const check = [...checkedStatus];
        check.forEach((value => value.checkedStatus = true))
        setCheckedStatus(check)
        return true;

    }

    const handleResetAll = () => {
        const check = [...checkedStatus];
        check.forEach((value => value.checkedStatus = false))
        setCheckedStatus(check)
        return true;
    }

    const handleCheckboxChange = (checked: boolean, index: number) => {
        const check = [...checkedStatus];
        check[index].checkedStatus = checked;
        setCheckedStatus(check);
    }

    const content = (
        <>
            <div className="checkbox-select-filters p-2 d-flex justify-content-between">
                <div>
                    <label><input type="checkbox" checked={checkedAll} onChange={handleSelectAll} name="select-all"/>
                        <span className="text-blue ml-2">alle auswahlen</span></label>
                </div>
                <div>
                    <label>
                        <input type="checkbox" checked={resetAll} onChange={handleResetAll} name="deselect-all"/>
                        <span className="text-blue ml-2">alle abwahlen</span></label>
                </div>
            </div>
            {
                checkedStatus &&
                <div className="checkbox-filters" style={{height: '400px', overflowY: 'scroll'}}>
                    {
                        checkedStatus.map((val: any, index: number) => (
                            <div key={val.id} className="p-2 border-top-1 border-bottom-1 border-border-gray">
                                <label>
                                    <input checked={val.checkedStatus}
                                           disabled={val.count === 0}
                                           onChange={(e) => handleCheckboxChange(e.target.checked, index)}
                                           type="checkbox"
                                           name={val.value}/>
                                    <span className="ml-2 font-size-14px"
                                          style={{color: val.count === 0 ? 'silver' : 'black'}}
                                    >{val.name}</span>
                                </label>
                            </div>
                        ))
                    }
                </div>
            }
        </>
    );


    if (loading) {
        <Row style={{height: "50px"}} className="d-flex justify-content-center pt-2">
            <Spinner animation="border"/>
        </Row>
    }

    if (error) {
        return null;
    }


    return (
        <>
            {
                showButton &&
                <Dropdown show={show && isDesktop} className={className}>
                    <DropdownButton text="Emittent" subText={subText()} onClick={() => {
                        if (onClick) onClick();
                        setShow(!show)
                    }} style={{minWidth: 140}} className={!!subText() && subText().trim() !== '' ? "active" : ""} />

                    <Dropdown.Menu className="p-2 dropdown-menu-content d-md-block d-none" style={{width: 330}}>
                        <DropdownMenuHeader title="Emittent" close={() => cancelFilter()}/>
                        {content}
                        <DropdownMenuFooter apply={() => applyFilter()} reset={() => resetFilter()}/>
                    </Dropdown.Menu>
                </Dropdown>
            }

            {
                showContent && !isDesktop &&
                <CSSTransition timeout={250}
                               classNames={"carusel-modal-right"}
                               in={contentActive}>
                    <div className={"container carusel-modal-right"} onClick={(event) => {
                        event.stopPropagation();
                    }}>

                        <div className="d-flex justify-content-between bg-white py-3 pl-3">
                            <span className="font-weight-bold roboto-heading">Emittent</span>
                            <button type="button" className="btn btn-link"
                                    onClick={() => {
                                        cancelFilter();
                                    }}>schließen<SvgCancel></SvgCancel></button>
                        </div>

                        <div className="mx-auto" style={{width: "330px"}}>
                            {content}
                        </div>


                        <div className="d-flex justify-content-end border-0 bg-white modal-footer">
                            <button type="button" className="pr-0 btn btn-link" onClick={() => applyFilter()}>
                                <SvgCheck></SvgCheck>Einstellung übernehmen
                            </button>
                        </div>

                    </div>
                </CSSTransition>
            }
        </>
    );
}
